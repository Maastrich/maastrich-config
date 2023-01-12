import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

declare global {
  const config: any;
}

function write(path: string, object: Record<string, unknown> = {}): void {
  writeFileSync(path, JSON.stringify(object));
}

function read<T>(path: string): T {
  const content = readFileSync(path, "utf-8");
  return JSON.parse(content);
}

interface ConfigOptions<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * The path to the config folder
   * @default ~/.config
   */
  path?: string;

  defaultConfig?: T;
}

class Config<T extends Record<string, unknown> = Record<string, unknown>> {
  private path: string;
  private config: T;
  constructor(private name: string, private options?: ConfigOptions<T>) {
    const configFolder =
      options?.path ?? join(process.env.HOME ?? "", ".config");
    if (!existsSync(configFolder)) {
      throw new Error("The path provided as the config folder does not exist");
    }
    const folderStats = statSync(configFolder);
    if (!folderStats.isDirectory()) {
      throw new Error(
        "The path provided as the config folder is not a directory"
      );
    }
    this.path = join(
      options?.path ?? join(process.env.HOME ?? "", ".config"),
      name
    );
    if (!existsSync(this.path)) {
      write(this.path, options?.defaultConfig);
    }
    const fileStats = statSync(this.path);
    if (!fileStats.isFile()) {
      throw new Error("The path provided as the config file is not a file");
    }
    this.config = read(this.path);
  }

  get(key: string) {
    return this.config[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.config[key] = value;
    write(this.path, this.config);
  }

  delete<K extends keyof T>(key: K) {
    delete this.config[key];
    write(this.path, this.config);
  }

  clear() {
    this.config = this.options?.defaultConfig ?? ({} as T);
    write(this.path, this.config);
  }
}

/**
 *
 * @param name The name of the project you want to load the config for
 * @returns An instance of the Config class that allow you to access and update the config for the project
 */
function load<T extends Record<string, unknown> = Record<string, unknown>>(
  name: string,
  options?: ConfigOptions<T>
): Config<T> {
  const config = new Config(name, options);
  Object.assign(globalThis, { config });
  return config;
}

export { load, Config };
