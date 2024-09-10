import React, { useState } from "react";
import Partition from "./components/Partition";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/Resizeable";

interface PartitionConfig {
  id: string;
  split: "horizontal" | "vertical" | null;
  children: PartitionConfig[];
}

const App: React.FC = () => {
  const [partitions, setPartitions] = useState<PartitionConfig>({
    id: "root",
    split: null,
    children: [],
  });

  const addPartition = (id: string, split: "horizontal" | "vertical") => {
    const createPartition = (id: string): PartitionConfig => ({
      id,
      split: null,
      children: [],
    });

    const addSplit = (
      config: PartitionConfig,
      split: "horizontal" | "vertical"
    ): PartitionConfig => {
      if (config.id === id) {
        return {
          ...config,
          split,
          children: [createPartition(`${id}-1`), createPartition(`${id}-2`)],
        };
      }
      return {
        ...config,
        children: config.children.map((child) => addSplit(child, split)),
      };
    };

    setPartitions((prev) => addSplit(prev, split));
  };

  const removePartition = (idToRemove: string) => {
    const removeFromConfig = (
      config: PartitionConfig,
      idToRemove: string
    ): PartitionConfig | null => {
      // If the current partition is the one to remove, return null to remove it
      if (config.id === idToRemove) {
        return null;
      }

      // If the current partition has children, process each child
      if (config.children.length > 0) {
        const updatedChildren = config.children
          .map((child) => removeFromConfig(child, idToRemove))
          .filter((child) => child !== null) as PartitionConfig[];

        // If there's only one child after removal, promote it to the parent's level
        if (updatedChildren.length === 1 && config.split) {
          return updatedChildren[0];
        }

        // Return updated config with filtered children
        return { ...config, children: updatedChildren };
      }

      // Return the config if no changes are needed
      return config;
    };

    setPartitions((prev) => removeFromConfig(prev, idToRemove) || prev);
  };

  // Function to check if the partition should show the remove button
  const shouldShowRemoveButton = (
    config: PartitionConfig,
    parentId: string | null = null
  ): boolean => {
    // Check if the partition is a leaf
    if (!config.split) {
      // If there is no parent (i.e., root partition) and it’s a single partition, don’t show remove button
      if (parentId === null && config.children.length === 0) {
        return false;
      }

      // Check if the parent has other siblings
      if (parentId !== null) {
        const parent = findParent(partitions, parentId);
        if (parent) {
          return parent.children.length > 1;
        }
      }
      return true;
    }

    // Not a leaf partition, so we always show the remove button
    return true;
  };

  // Helper function to find a parent partition
  const findParent = (
    config: PartitionConfig,
    targetId: string
  ): PartitionConfig | null => {
    if (config.children.some((child) => child.id === targetId)) {
      return config;
    }

    for (const child of config.children) {
      const parent = findParent(child, targetId);
      if (parent) {
        return parent;
      }
    }

    return null;
  };

  const renderPartitionGroup = (
    config: PartitionConfig,
    parentId: string | null = null
  ): JSX.Element => {
    const showRemove = shouldShowRemoveButton(config, parentId);

    if (!config.split) {
      return (
        <>
          <ResizablePanel
            defaultSize={50}
            key={config.id}
            className="w-full h-full"
          >
            <Partition
              onVerticalSplit={() => addPartition(config.id, "vertical")}
              onHorizontalSplit={() => addPartition(config.id, "horizontal")}
              onRemove={() => removePartition(config.id)}
              showRemove={showRemove}
            />
          </ResizablePanel>
          <ResizableHandle />
        </>
      );
    }

    return (
      <ResizablePanelGroup
        direction={config.split}
        key={config.id}
        className="w-full h-full"
      >
        {config.children.map((child) => (
          <>
            <ResizablePanel defaultSize={50} className="w-full h-full">
              {renderPartitionGroup(child, config.id)}
            </ResizablePanel>
            <ResizableHandle />
          </>
        ))}
      </ResizablePanelGroup>
    );
  };

  return (
    <main className="h-screen w-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        {renderPartitionGroup(partitions)}
      </ResizablePanelGroup>
    </main>
  );
};

export default App;
