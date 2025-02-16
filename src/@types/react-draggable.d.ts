declare module "react-draggable" {
  import { Component } from "react";

  interface DraggableProps {
    axis?: "both" | "x" | "y";
    handle?: string;
    cancel?: string;
    onStart?: (e: MouseEvent | TouchEvent) => void;
    onDrag?: (e: MouseEvent | TouchEvent) => void;
    onStop?: (e: MouseEvent | TouchEvent) => void;
    // Add other props as needed
  }

  export class Draggable extends Component<DraggableProps> {}
}
