import { useLayoutEffect, useRef, useState } from "react";
import type { Workspace } from "../features/dashboard/types";

type ProjectBridgeSlide = {
  insertedCarouselIndex: number;
  jumpToCarouselIndex: number;
  workspace: Workspace;
};

type RenderedCarouselWorkspace = {
  key: string;
  workspace: Workspace;
};

type UseWorkspaceCarouselParams = {
  workspaces: Workspace[];
  activeWorkspaceId: number;
  onActiveWorkspaceChange: (workspaceId: number) => void;
};

function getActiveWorkspaceIndex(
  targetWorkspaceId: number,
  sourceWorkspaces: Workspace[]
) {
  const activeWorkspaceIndex = sourceWorkspaces.findIndex(
    (workspace) => workspace.id === targetWorkspaceId
  );

  return activeWorkspaceIndex === -1 ? 0 : activeWorkspaceIndex;
}

function useWorkspaceCarousel({
  workspaces,
  activeWorkspaceId,
  onActiveWorkspaceChange
}: UseWorkspaceCarouselParams) {
  const previousWorkspacesRef = useRef(workspaces);
  const previousActiveWorkspaceIdRef = useRef(activeWorkspaceId);
  const [carouselIndex, setCarouselIndex] = useState(() => {
    const initialActiveWorkspaceIndex = getActiveWorkspaceIndex(
      activeWorkspaceId,
      workspaces
    );

    return workspaces.length > 1 ? initialActiveWorkspaceIndex + 1 : 0;
  });
  const [isWorkspaceTransitionEnabled, setIsWorkspaceTransitionEnabled] = useState(true);
  const [projectBridgeSlide, setProjectBridgeSlide] =
    useState<ProjectBridgeSlide | null>(null);
  const shouldUseClonedSlides = workspaces.length > 1;

  const restoreWorkspaceTransition = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsWorkspaceTransitionEnabled(true);
      });
    });
  };

  useLayoutEffect(() => {
    const previousWorkspaces = previousWorkspacesRef.current;
    const previousActiveWorkspaceId = previousActiveWorkspaceIdRef.current;

    if (workspaces.length === previousWorkspaces.length + 1) {
      const previousWorkspaceCount = previousWorkspaces.length;
      const currentActiveWorkspaceIndex = getActiveWorkspaceIndex(
        previousActiveWorkspaceId,
        previousWorkspaces
      );
      const nextWorkspace = workspaces[workspaces.length - 1];

      if (previousWorkspaceCount === 1) {
        setProjectBridgeSlide(null);
        setIsWorkspaceTransitionEnabled(false);
        setCarouselIndex(1);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsWorkspaceTransitionEnabled(true);
            setCarouselIndex(2);
          });
        });
      } else if (currentActiveWorkspaceIndex === previousWorkspaceCount - 1) {
        setProjectBridgeSlide(null);
        setIsWorkspaceTransitionEnabled(true);
        setCarouselIndex((currentIndex) => currentIndex + 1);
      } else {
        setProjectBridgeSlide({
          insertedCarouselIndex: carouselIndex + 1,
          jumpToCarouselIndex: workspaces.length,
          workspace: nextWorkspace
        });
        setIsWorkspaceTransitionEnabled(true);
        setCarouselIndex(carouselIndex + 1);
      }
    } else if (workspaces.length === previousWorkspaces.length - 1) {
      const nextActiveWorkspaceIndex = getActiveWorkspaceIndex(
        activeWorkspaceId,
        workspaces
      );

      setIsWorkspaceTransitionEnabled(false);
      setCarouselIndex(workspaces.length > 1 ? nextActiveWorkspaceIndex + 1 : 0);
      restoreWorkspaceTransition();
    }

    previousWorkspacesRef.current = workspaces;
    previousActiveWorkspaceIdRef.current = activeWorkspaceId;
  }, [activeWorkspaceId, carouselIndex, workspaces]);

  const goToNextWorkspace = () => {
    if (workspaces.length <= 1) {
      return;
    }

    const currentActiveWorkspaceIndex = getActiveWorkspaceIndex(
      activeWorkspaceId,
      workspaces
    );

    setIsWorkspaceTransitionEnabled(true);
    setCarouselIndex((currentIndex) => currentIndex + 1);
    onActiveWorkspaceChange(
      workspaces[(currentActiveWorkspaceIndex + 1) % workspaces.length].id
    );
  };

  const goToPreviousWorkspace = () => {
    if (workspaces.length <= 1) {
      return;
    }

    const currentActiveWorkspaceIndex = getActiveWorkspaceIndex(
      activeWorkspaceId,
      workspaces
    );

    setIsWorkspaceTransitionEnabled(true);
    setCarouselIndex((currentIndex) => currentIndex - 1);
    onActiveWorkspaceChange(
      workspaces[
        (currentActiveWorkspaceIndex - 1 + workspaces.length) % workspaces.length
      ].id
    );
  };

  const handleWorkspaceTrackTransitionEnd = () => {
    if (!shouldUseClonedSlides) {
      return;
    }

    if (
      projectBridgeSlide &&
      carouselIndex === projectBridgeSlide.insertedCarouselIndex
    ) {
      setIsWorkspaceTransitionEnabled(false);
      setProjectBridgeSlide(null);
      setCarouselIndex(projectBridgeSlide.jumpToCarouselIndex);
      restoreWorkspaceTransition();
      return;
    }

    if (carouselIndex === workspaces.length + 1) {
      setIsWorkspaceTransitionEnabled(false);
      setCarouselIndex(1);
      onActiveWorkspaceChange(workspaces[0].id);
      restoreWorkspaceTransition();
      return;
    }

    if (carouselIndex === 0) {
      setIsWorkspaceTransitionEnabled(false);
      setCarouselIndex(workspaces.length);
      onActiveWorkspaceChange(workspaces[workspaces.length - 1].id);
      restoreWorkspaceTransition();
    }
  };

  const carouselWorkspaces: RenderedCarouselWorkspace[] = shouldUseClonedSlides
    ? [
        {
          key: `clone-last-${workspaces[workspaces.length - 1].id}`,
          workspace: workspaces[workspaces.length - 1]
        },
        ...workspaces.map((workspace) => ({
          key: `workspace-${workspace.id}`,
          workspace
        })),
        {
          key: `clone-first-${workspaces[0].id}`,
          workspace: workspaces[0]
        }
      ]
    : workspaces.map((workspace) => ({
        key: `workspace-${workspace.id}`,
        workspace
      }));

  const renderedCarouselWorkspaces = projectBridgeSlide
    ? [
        ...carouselWorkspaces.slice(0, projectBridgeSlide.insertedCarouselIndex),
        {
          key: `bridge-project-${projectBridgeSlide.workspace.id}`,
          workspace: projectBridgeSlide.workspace
        },
        ...carouselWorkspaces.slice(projectBridgeSlide.insertedCarouselIndex)
      ]
    : carouselWorkspaces;

  return {
    carouselIndex,
    isWorkspaceTransitionEnabled,
    renderedCarouselWorkspaces,
    goToNextWorkspace,
    goToPreviousWorkspace,
    handleWorkspaceTrackTransitionEnd
  };
}

export default useWorkspaceCarousel;
