class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function reverstListFun1(head: ListNode | null) {
  let pre = null;
  while (head) {
    let next = head.next;
    head.next = pre;
    pre = head;
    head = next;
  }
  return pre;
}

const head = new ListNode(
  1,
  new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5))))
);
const res = reverstListFun1(head);
console.log(reverstListFun1(head));
// print 5 -> 4 -> 3 -> 2 -> 1
let current = res;
while (current) {
  console.log(current.val);
  current = current.next;
}
