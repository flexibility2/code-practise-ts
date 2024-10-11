interface MyTest {
  name: string;
  priority: "High" | "Medium" | "Low";
  falkness: number;
  duration: number;
  expectedDuratin?: number;
}

function computeExpectedDuration(duration: number, falkness: number) {
  const expectedRuns = 1 / (1 - falkness);
  return duration * expectedRuns;
}

function scheduledTest(tests: MyTest[]): string[] {
  tests.forEach((test) => {
    test.expectedDuratin = computeExpectedDuration(
      test.duration,
      test.falkness
    );
  });
  const priorityGroups: { [key: string]: MyTest[] } = {
    High: [],
    Medium: [],
    Low: [],
  };
  tests.forEach((test) => {
    priorityGroups[test.priority].push(test);
  });

  const res: MyTest[] = [];
  ["High", "Medium", "Low"].forEach((item) => {
    priorityGroups[item].sort(
      (a, b) => a.expectedDuratin! - b.expectedDuratin!
    );
    res.push(...priorityGroups[item]);
  });

  return res.map((item) => item.name);
}

const myInputData: MyTest[] = [
  { name: "T1", duration: 30, priority: "High", falkness: 0.1 },
  { name: "T2", duration: 40, priority: "Medium", falkness: 0.7 },
  { name: "T3", duration: 20, priority: "High", falkness: 0.05 },
  { name: "T4", duration: 15, priority: "Low", falkness: 0 },
];

console.log(JSON.stringify(scheduledTest(myInputData)));
