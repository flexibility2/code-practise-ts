interface Test {
    name: string;
    duration: number;
    priority: 'High' | 'Medium' | 'Low';
    flakiness: number;
    expectedDuration?: number;
}

function computeExpectedDuration(test: Test): number {
    const expectedRuns = 1 / (1 - test.flakiness);
    return test.duration * expectedRuns;
}

function scheduleTTests(tests: Test[]): string[] {
    // 在這裡設置斷點，查看輸入的測試數據
    tests.forEach(test => {
        // 在這裡設置斷點，查看每個測試的預期持續時間計算
        test.expectedDuration = computeExpectedDuration(test);
    });

    // 按优先级分组
    const priorityGroups: { [key: string]: Test[] } = {
        'High': [],
        'Medium': [],
        'Low': []
    };

    tests.forEach(test => {
        priorityGroups[test.priority].push(test);
    });

    // 在這裡設置斷點，查看每個優先級組的排序結果
    const scheduledTests: Test[] = [];
    ['High', 'Medium', 'Low'].forEach(priority => {
        priorityGroups[priority].sort((a, b) => a.expectedDuration! - b.expectedDuration!);
        scheduledTests.push(...priorityGroups[priority]);
    });

    // 在這裡設置斷點，查看最終的調度結果
    return scheduledTests.map(test => test.name);
}

// 输入数据
const inputData: Test[] = [
    {"name": "T1", "duration": 30, "priority": "High", "flakiness": 0.1},
    {"name": "T2", "duration": 40, "priority": "Medium", "flakiness": 0.7},
    {"name": "T3", "duration": 20, "priority": "High", "flakiness": 0.05},
    {"name": "T4", "duration": 15, "priority": "Low", "flakiness": 0}
];

// 执行调度
const result = scheduleTTests(inputData);

// 在這裡設置斷點，查看最終輸出
console.log(JSON.stringify(result));