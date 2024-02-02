import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	// FunctionComponent,保存的是这个方法() => FunctionComponent
	type: any;
	tag: WorkTag;
	stateNode: any;
	key: Key;
	// <div> 保存的是div这个Dom元素
	ref: Ref;

	// 保存节点间的联系，构成树形结构
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	// 同级节点的索引
	index: number;

	// 作为工作单元
	pendingProps: Props;
	memoizedProps: Props | null;
	memorizedState: any;
	updateQueue: unknown;

	// 指向两颗Fiber Tree中的另外一颗
	alternate: FiberNode | null;
	// 标记当前Fiber的操作,统称为副作用
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.type = null;
		this.tag = tag;
		this.key = key;
		this.stateNode = null;

		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memorizedState = null;
		this.updateQueue = null;

		this.alternate = null;
		this.flags = NoFlags;
	}
}

export class FiberRootNode {
	// 保存的是根节点
	container: Container;
	// 保存的是根节点的FiberNode
	current: FiberNode;
	// 保存更新流程结束后的rootFiber
	finishedWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);

		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		// 清空副作用
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memorizedState = current.memorizedState;
	return wip;
};
