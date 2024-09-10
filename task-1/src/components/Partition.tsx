import { FC } from "react";

interface PartitionProps {
  onVerticalSplit: () => void;
  onHorizontalSplit: () => void;
  onRemove: () => void;
  showRemove: boolean; // New prop
}

const Partition: FC<PartitionProps> = ({
  onVerticalSplit,
  onHorizontalSplit,
  onRemove,
  showRemove,
}) => {
  return (
    <div className="w-full h-full flex justify-center items-center gap-3 border-[0.5px]">
      <button
        className="border-none outline-none rounded bg-blue-500 text-white py-1 px-4 text-[12px]"
        onClick={onVerticalSplit}
      >
        V
      </button>
      <button
        className="border-none outline-none rounded bg-blue-500 text-white py-1 px-4 text-[12px]"
        onClick={onHorizontalSplit}
      >
        H
      </button>
      {showRemove && ( // Conditionally render the remove button
        <button
          className="border-none outline-none rounded bg-red-500 text-white py-1 px-4 text-[12px]"
          onClick={onRemove}
        >
          -
        </button>
      )}
    </div>
  );
};

export default Partition;
