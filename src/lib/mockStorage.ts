type CreateInput<T> = Omit<T, "id">;

interface MockStorageOptions {
  latencyMs?: number;
  seedVersion?: string;
}

export class MockStorage<T extends { id: number }> {
  private key: string;
  private versionKey: string;
  private initialData: T[];
  private latencyMs: number;
  private seedVersion?: string;

  constructor(key: string, initialData: T[], options?: MockStorageOptions) {
    this.key = key;
    this.versionKey = `${key}:seed-version`;
    this.initialData = initialData;
    this.latencyMs = options?.latencyMs ?? 250;
    this.seedVersion = options?.seedVersion;
    this.ensureInitialized();
  }

  private ensureInitialized() {
    const existing = localStorage.getItem(this.key);
    const savedSeedVersion = localStorage.getItem(this.versionKey);
    const shouldResetFromSeed =
      this.seedVersion !== undefined && savedSeedVersion !== this.seedVersion;

    if (!existing || shouldResetFromSeed) {
      localStorage.setItem(this.key, JSON.stringify(this.initialData));
      if (this.seedVersion) {
        localStorage.setItem(this.versionKey, this.seedVersion);
      }
    }
  }

  private read(): T[] {
    const raw = localStorage.getItem(this.key);
    if (!raw) return [...this.initialData];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [...this.initialData];
    }
  }

  private write(data: T[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  private async withLatency<R>(value: R): Promise<R> {
    await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    return value;
  }

  async getAll(): Promise<T[]> {
    return this.withLatency(this.read());
  }

  async getById(id: number): Promise<T | null> {
    const item = this.read().find((entry) => entry.id === id) ?? null;
    return this.withLatency(item);
  }

  async create(data: CreateInput<T>): Promise<T> {
    const items = this.read();
    const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    const created = { ...data, id: nextId } as T;
    this.write([...items, created]);
    return this.withLatency(created);
  }

  async update(id: number, data: Partial<Omit<T, "id">>): Promise<T | null> {
    const items = this.read();
    const index = items.findIndex((entry) => entry.id === id);
    if (index === -1) return this.withLatency(null);

    const updated = { ...items[index], ...data, id } as T;
    const next = [...items];
    next[index] = updated;
    this.write(next);
    return this.withLatency(updated);
  }

  async remove(id: number): Promise<boolean> {
    const items = this.read();
    const next = items.filter((entry) => entry.id !== id);
    const removed = next.length !== items.length;
    if (removed) {
      this.write(next);
    }
    return this.withLatency(removed);
  }

  async reset(): Promise<void> {
    this.write([...this.initialData]);
    await this.withLatency(undefined);
  }
}
