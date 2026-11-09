import { Node, mergeAttributes } from "@tiptap/core";
import { getYouTubeId } from "./video";

export interface YoutubeOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Insert a YouTube video embed
       */
      addYoutubeVideo: (options: { src: string }) => ReturnType;
      /**
       * Set a YouTube video embed
       */
      setYoutubeVideo: (options: { src: string }) => ReturnType;
    };
  }
}

export const Youtube = Node.create<YoutubeOptions>({
  name: "youtube",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      videoId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video]",
        getAttrs: (dom) => {
          const el = dom as HTMLElement;
          const iframe = el.querySelector("iframe");
          const src = iframe?.getAttribute("src") || el.getAttribute("data-src") || "";
          const videoId = el.getAttribute("data-video-id") || getYouTubeId(src);
          return {
            src,
            videoId,
          };
        },
      },
      {
        tag: "div.youtube-video-container",
        getAttrs: (dom) => {
          const el = dom as HTMLElement;
          const iframe = el.querySelector("iframe");
          const src = iframe?.getAttribute("src") || el.getAttribute("data-src") || "";
          const videoId = el.getAttribute("data-video-id") || getYouTubeId(src);
          return {
            src,
            videoId,
          };
        },
      },
      {
        tag: "iframe[src*=\"youtube.com\"]",
        getAttrs: (dom) => {
          const el = dom as HTMLIFrameElement;
          const src = el.getAttribute("src") || "";
          return {
            src,
            videoId: getYouTubeId(src),
          };
        },
      },
      {
        tag: "iframe[src*=\"youtu.be\"]",
        getAttrs: (dom) => {
          const el = dom as HTMLIFrameElement;
          const src = el.getAttribute("src") || "";
          return {
            src,
            videoId: getYouTubeId(src),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const videoId = HTMLAttributes.videoId || getYouTubeId(HTMLAttributes.src);
    const embedSrc = videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0`
      : HTMLAttributes.src;

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-youtube-video": "",
        "data-video-id": videoId || "",
        class: "youtube-video-container my-6 ml-0 mr-auto relative w-full max-w-[640px] aspect-video rounded-2xl overflow-hidden shadow-md bg-black",
      }),
      [
        "iframe",
        {
          src: embedSrc,
          width: "100%",
          height: "100%",
          allowfullscreen: "true",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          class: "absolute inset-0 w-full h-full border-0",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options: { src: string }) =>
        ({ commands }) => {
          const videoId = getYouTubeId(options.src);
          if (!videoId) return false;
          const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: embedUrl,
              videoId,
            },
          });
        },
      addYoutubeVideo:
        (options: { src: string }) =>
        ({ commands }) => {
          const videoId = getYouTubeId(options.src);
          if (!videoId) return false;
          const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: embedUrl,
              videoId,
            },
          });
        },
    };
  },
});
