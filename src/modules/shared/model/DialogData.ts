import { ReactNode } from "react";

export class DialogData {
    constructor(
        public title: string,
        public dismissOnClickOutside: boolean,
        public content: ReactNode
    ) { }
}