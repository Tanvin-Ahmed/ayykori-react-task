import React, { Fragment, useState } from "react";
import Partition from "./components/Partition";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/Resizeable";
import { getRandomColor } from "./utils/utils";

interface PartitionConfig {
  id: string;
  split: "horizontal" | "vertical" | null;
  children: PartitionConfig[];
  bgColor: string;
}

const App: React.FC = () => {
  const [partitions, setPartitions] = useState<PartitionConfig>({
    id: "root",
    split: null,
    children: [],
    bgColor: getRandomColor(),
  });

  const addPartition = (id: string, split: "horizontal" | "vertical") => {
    const createPartition = (id: string, bgColor: string): PartitionConfig => ({
      id,
      split: null,
      children: [],
      bgColor,
    });

    const addSplit = (
      config: PartitionConfig,
      split: "horizontal" | "vertical"
    ): PartitionConfig => {
      if (config.id === id) {
        return {
          ...config,
          split,
          children: [
            createPartition(`${id}-1`, config.bgColor),
            createPartition(`${id}-2`, getRandomColor()),
          ],
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
      if (config.id === idToRemove) {
        return null;
      }

      if (config.children.length > 0) {
        const updatedChildren = config.children
          .map((child) => removeFromConfig(child, idToRemove))
          .filter((child) => child !== null) as PartitionConfig[];

        if (updatedChildren.length === 1 && config.split) {
          return updatedChildren[0];
        }

        return { ...config, children: updatedChildren };
      }

      return config;
    };

    setPartitions((prev) => removeFromConfig(prev, idToRemove) || prev);
  };

  const shouldShowRemoveButton = (
    config: PartitionConfig,
    parentId: string | null = null
  ): boolean => {
    if (!config.split) {
      if (parentId === null && config.children.length === 0) {
        return false;
      }
      if (parentId !== null) {
        const parent = findParent(partitions, parentId);
        if (parent) {
          return parent.children.length > 1;
        }
      }
      return true;
    }
    return true;
  };

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
        <Fragment key={config.id}>
          <ResizablePanel
            defaultSize={50}
            className={`w-full h-full`}
            style={{ backgroundColor: config.bgColor }}
          >
            <Partition
              onVerticalSplit={() => addPartition(config.id, "vertical")}
              onHorizontalSplit={() => addPartition(config.id, "horizontal")}
              onRemove={() => removePartition(config.id)}
              showRemove={showRemove}
            />
          </ResizablePanel>
          <ResizableHandle />
        </Fragment>
      );
    }

    return (
      <ResizablePanelGroup
        direction={config.split}
        key={config.id}
        className="w-full h-full"
      >
        {config.children.map((child) => (
          <Fragment key={child.id}>
            <ResizablePanel
              defaultSize={50}
              className={`w-full h-full`}
              style={{ backgroundColor: child.bgColor }}
            >
              {renderPartitionGroup(child, config.id)}
            </ResizablePanel>
            <ResizableHandle />
          </Fragment>
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
