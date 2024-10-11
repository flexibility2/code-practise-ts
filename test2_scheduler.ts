interface Test2 {
  name: string;
  duration: number;
  dependencies: string[];
  flakiness: number;
}

class TestNode {
  name: string;
  duration: number;
  dependencies: string[];
  flakiness: number;
  expectedDuration: number;

  constructor(test: Test2) {
    this.name = test.name;
    this.duration = test.duration;
    this.dependencies = test.dependencies;
    this.flakiness = test.flakiness;
    this.expectedDuration = this.computeExpectedDuration();
  }

  computeExpectedDuration(): number {
    const expectedRuns =
      this.flakiness < 1 ? 1 / (1 - this.flakiness) : Infinity;
    return this.duration * expectedRuns;
  }
}

function scheduleTests(tests: Test2[]): string[] {
  const testNodes = tests.map((test) => new TestNode(test));
  const nameToNode = new Map<string, TestNode>(
    testNodes.map((node) => [node.name, node])
  );

  // 创建依赖图
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  testNodes.forEach((node) => {
    adjacencyList.set(node.name, []);
    inDegree.set(node.name, 0);
  });

  testNodes.forEach((node) => {
    node.dependencies.forEach((dep) => {
      adjacencyList.get(dep)!.push(node.name);
      inDegree.set(node.name, inDegree.get(node.name)! + 1);
    });
  });

  // 拓扑排序
  const queue: string[] = [];
  inDegree.forEach((degree, name) => {
    if (degree === 0) queue.push(name);
  });

  const sortedTests: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sortedTests.push(current);
    adjacencyList.get(current)!.forEach((neighbor) => {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }

  return sortedTests;
}

// 输入数据
const inputData2: Test2[] = [
  { name: "T1", duration: 30, dependencies: [], flakiness: 0 },
  { name: "T2", duration: 10, dependencies: ["T3"], flakiness: 0 },
  { name: "T3", duration: 20, dependencies: ["T1", "T4"], flakiness: 0 },
  { name: "T4", duration: 90, dependencies: [], flakiness: 0 },
];

// 执行调度
const aa = scheduleTests(inputData2);

// 输出结果
console.log(JSON.stringify(aa));
