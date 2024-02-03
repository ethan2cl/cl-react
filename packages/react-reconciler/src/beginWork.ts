// “递”

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';

/**
 * 比较，返回子FiberNode
 */
export const beginWork = (wip: FiberNode): FiberNode | null => {
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostText(wip);
		case HostText:
			return null;
		default:
			break;
	}
	return wip.child;
};

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memorizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memorizedState = memoizedState;

	const nextChildren = wip.memorizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostText(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;
	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
