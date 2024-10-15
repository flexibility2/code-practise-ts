class VirtualFileSystem {
  private currentDir: Directory;

  constructor() {
    this.currentDir = new Directory("root");
  }

  // Changes current directory
  //  Special case:
  //      ".." -> Go up a directory
  cd(dir: string) {
    if (dir === "..") {
      if (this.currentDir.parent) {
        this.currentDir = this.currentDir.parent;
      } else {
        console.log("has no up directory");
      }
    } else {
      const nextDir = this.currentDir.getSubDirectory(dir);
      if (nextDir) {
        this.currentDir = nextDir;
      } else {
        console.log("This direcory has no sub directoies");
      }
    }
  }

  // Should print contents of current directory
  ls() {
    const content = this.currentDir.listContents();
    console.log(content.length > 0 ? content.join(",") : "Dirctory is Emptpy");
  }

  // Print current 'directory'
  pwd() {
    let path = [];
    let dir: Directory | undefined = this.currentDir;

    while (dir) {
      path.unshift(dir.name);
      dir = dir.parent;
    }
    console.log(path.join("/"));
  }

  // Create directory
  mkdir(dir: string) {
    if (!this.currentDir.getSubDirectory(dir)) {
      const newDir = new Directory(dir, this.currentDir);
      this.currentDir.addSubDirectory(newDir);
    } else {
      console.log("Director is existing");
    }
  }

  // Creates a file in the current directory with content
  touch(fileName: string, content: string = "") {
    if (!this.currentDir.getFile(fileName)) {
      const newFile = new MyFile(fileName, content);
      this.currentDir.addFile(newFile);
    } else {
      console.log("File also exists");
    }
  }

  // Deletes files or empty directories
  // Will delete folders with content only if recrusive is set to true
  rm(path: string, recursive = false) {
    const target =
      this.currentDir.getSubDirectory(path) || this.currentDir.getFile(path);

    if (target instanceof Directory) {
      if (recursive || target.isEmpty()) {
        this.currentDir.removeSubDirectory(target);
      } else {
        console.log("Dirctory is not empty. Use recursive option to delete");
      }
    } else if (target instanceof MyFile) {
      this.currentDir.removeFile(target);
    } else {
      console.log("The path does not exist");
    }
  }
}

class Directory {
  name: string;
  parent?: Directory;
  private subDirectories: Directory[] = [];
  private file: MyFile[] = [];

  constructor(name: string, parent?: Directory) {
    this.name = name;
    this.parent = parent;
  }

  addSubDirectory(dir: Directory) {
    this.subDirectories.push(dir);
  }
  removeSubDirectory(dir: Directory) {
    this.subDirectories = this.subDirectories.filter((d) => d !== dir);
  }
  getSubDirectory(name: string): Directory | undefined {
    return this.subDirectories.find((d) => d.name === name);
  }
  addFile(file: MyFile) {
    this.file.push(file);
  }
  removeFile(file: MyFile) {
    this.file = this.file.filter((f) => f !== file);
  }
  getFile(name: string) {
    return this.file.find((f) => f.name == name);
  }
  listContents(): Array<string> {
    return [
      ...this.subDirectories.map((d) => d.name),
      ...this.file.map((f) => f.name),
    ];
  }
  isEmpty(): boolean {
    return this.subDirectories.length === 0 && this.file.length === 0;
  }
}

class MyFile {
  name: string;
  content: string;
  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}
