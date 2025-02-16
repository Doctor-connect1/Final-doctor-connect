declare module "react-modal" {
  import { Component } from "react";

  interface ModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    contentLabel?: string;
    // Add other props as needed
  }

  export default class Modal extends Component<ModalProps> {
    static setAppElement(element: string | HTMLElement): void;
  }
}
