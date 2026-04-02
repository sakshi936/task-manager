import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/tasks";
import { TaskCard } from "./TaskCard";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  dragDisabled: boolean;
};

export function SortableTaskRow({
  task,
  onEdit,
  onDelete,
  onToggle,
  dragDisabled,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: dragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        dragAttributes={dragDisabled ? undefined : attributes}
        dragListeners={dragDisabled ? undefined : listeners}
        isDragging={isDragging}
      />
    </div>
  );
}
