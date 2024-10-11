interface InputModel {
  name: string;
  duration: number;
  dependencied: string[];
  flakniss: number;
}

class Test2Node {
  name: string;
  duration: number;
  dependencied: string[];
  flakniss: number;
  expectedDuration: number;

  constructor(test: InputModel) {
    this.name = test.name;
    this.duration = test.duration;
    this.dependencied = test.dependencied;
    this.flakniss = test.flakniss;
    this.expectedDuration = this.computeExpectedDuration(
      test.duration,
      test.flakniss
    );
  }

  computeExpectedDuration(duration: number, falkness: number) {
    const expectedRuns = 1 / (1 - falkness);
    return duration * expectedRuns;
  }
}

function scheduletTestDAG(test: InputModel[]): string[] {
  const testNodes = test.map((item) => new Test2Node(item));
  const nameNodes: Map<string, Test2Node> = new Map<string, Test2Node>(
    testNodes.map((item) => [item.name, item])
  );

  const adjacencyMap = new Map<string, string[]>();
  const inDegreeMap = new Map<string, number>();

  testNodes.forEach((item) => {
    adjacencyMap.set(item.name, []);
    inDegreeMap.set(item.name, 0);
  });

  testNodes.forEach((item) => {
    item.dependencied.forEach((dep) => {
      adjacencyMap.get(dep)!.push(item.name);
      inDegreeMap.set(item.name, inDegreeMap.get(item.name)! + 1);
    });
  });

  const queue: Test2Node[] = [];
  inDegreeMap.forEach((item: number, cc: string) => {
    if (item === 0) {
      queue.push(nameNodes.get(cc)!);
    }
  });

  const sortedTest: string[] = [];
  while (queue.length > 0) {
    queue.sort((a, b) => a.expectedDuration - b.expectedDuration);
    const item = queue.shift();
    sortedTest.push(item!.name);
    adjacencyMap.get(item!.name)?.forEach((ne) => {
      inDegreeMap.set(ne, inDegreeMap.get(ne)! - 1);
      if (inDegreeMap.get(ne) === 0) {
        queue.push(nameNodes.get(ne)!);
      }
    });
  }
  return sortedTest;
}

const inputDataTest22: InputModel[] = [
  { name: "T1", duration: 30, dependencied: [], flakniss: 0.1 },
  { name: "T2", duration: 10, dependencied: ["T3"], flakniss: 0.2 },
  { name: "T3", duration: 20, dependencied: ["T1", "T4"], flakniss: 0.05 },
  { name: "T4", duration: 90, dependencied: [], flakniss: 0.3 },
];

const test22Res = scheduletTestDAG(inputDataTest22);
console.log(JSON.stringify(test22Res));
