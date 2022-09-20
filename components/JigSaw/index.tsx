import { useGesture } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../../store";
import MiniGameModal from "../MiniGameModal";
import MiniGameWrapper from "../MiniGameWrapper";
import useMutation from "../../Hooks/useMutation";
import { addReward } from "../../lib/inventory";

const paths = [
  "M11,14 v200 h48.589c37.5,0,26.367,13.463,26.367,13.463  c-3.14,4.743-4.979,10.422-4.979,16.537c0,16.569,13.432,30,30.001,30c16.569,0,29.999-13.431,29.999-30  c0-6.113-1.837-11.793-4.978-16.535c0,0-11.133-13.464,26.367-13.464H211v-47.917c0-37.5-13.464-26.367-13.464-26.367  c-4.742,3.14-10.422,4.978-16.535,4.978c-16.569,0-30-13.43-30-30c0-16.569,13.431-30,30-30c6.114,0,11.793,1.839,16.537,4.979  c0,0,13.463,11.133,13.463-26.367c0-0.235,0-0.46,0-0.694V14H11z",
  "M441,83.999 c-6.114,0-11.793,1.839-16.537,4.979  c0,0-13.463,11.133-13.463-26.367V14H211v48.611c0,37.5-13.463,26.367-13.463,26.367c-4.743-3.14-10.422-4.979-16.537-4.979  c-16.569,0-30,13.432-30,30.001s13.431,30,30,30c6.113,0,11.793-1.838,16.535-4.978c0,0,13.464-11.133,13.464,26.367V214h48.611  c37.5,0,26.367-13.463,26.367-13.463c-3.14-4.743-4.979-10.422-4.979-16.537c0-16.569,13.432-30,30.001-30s30,13.431,30,30  c0,6.113-1.838,11.793-4.978,16.535c0,0-11.133,13.464,26.367,13.464H411v-48.611c0-37.5,13.464-26.367,13.464-26.367  C429.206,142.162,434.886,144,441,144c16.569,0,30-13.431,30-30S457.568,83.999,441,83.999z",
  "M581.001,83.999 c6.114,0,11.792,1.839,16.536,4.979  c0,0,13.463,11.133,13.463-26.367V14H411v48.611c0,37.5,13.463,26.367,13.463,26.367c4.743-3.14,10.422-4.979,16.537-4.979  c16.569,0,30,13.432,30,30.001s-13.431,30-30,30c-6.113,0-11.793-1.838-16.535-4.978c0,0-13.464-11.133-13.464,26.367V214h48.611  c37.5,0,26.367,13.463,26.367,13.463c-3.14,4.743-4.979,10.422-4.979,16.537c0,16.569,13.432,30,30.001,30s30-13.431,30-30  c0-6.113-1.838-11.793-4.978-16.535c0,0-11.133-13.464,26.367-13.464H611v-48.611c0-37.5-13.466-26.367-13.466-26.367  c-4.741,3.14-10.422,4.978-16.533,4.978c-16.569,0-30-13.431-30-30S564.432,83.999,581.001,83.999z",
  "M811,14 H611 v48.591c0,37.5-13.463,26.367-13.463,26.367  c-4.744-3.14-10.422-4.979-16.536-4.979c-16.569,0-30,13.432-30,30c0,16.569,13.431,30,30,30c6.111,0,11.792-1.838,16.533-4.978  c0,0,13.466-11.133,13.466,26.367V214h47.917c37.5,0,26.367-13.463,26.367-13.463c-3.141-4.742-4.979-10.422-4.979-16.535  c0-16.569,13.431-30,30-30s30.001,13.431,30.001,30c0,6.116-1.84,11.793-4.979,16.538c0,0-11.133,13.46,26.367,13.46  c0.236,0,0.461,0,0.694,0H811V14z",

  "M80.999,244 c0-6.114,1.839-11.792,4.979-16.537  c0,0,11.133-13.463-26.367-13.463H11v200h48.611c37.5,0,26.367-13.463,26.367-13.463c-3.14-4.743-4.979-10.422-4.979-16.537  c0-16.569,13.432-30,30.001-30s30,13.431,30,30c0,6.113-1.838,11.793-4.978,16.535c0,0-11.133,13.464,26.367,13.464H211v-48.611  c0-37.5,13.463-26.367,13.463-26.367c4.743,3.14,10.422,4.979,16.537,4.979c16.569,0,30-13.432,30-30.001s-13.431-30-30-30  c-6.113,0-11.793,1.838-16.535,4.978c0,0-13.464,11.133-13.464-26.367V214h-48.611c-37.5,0-26.367,13.466-26.367,13.466  C139.162,232.208,141,237.888,141,244c0,16.569-13.431,30-30,30S80.999,260.568,80.999,244z",
  "M381,283.998 c6.114,0,11.792,1.839,16.537,4.979  c0,0,13.463,11.133,13.463-26.367v-48.611h-48.611c-37.5,0-26.367-13.464-26.367-13.464c3.14-4.742,4.978-10.422,4.978-16.535  c0-16.569-13.431-30-30-30s-30.001,13.431-30.001,30c0,6.115,1.839,11.793,4.979,16.537c0,0,11.133,13.463-26.367,13.463H211v48.611  c0,37.5,13.463,26.367,13.463,26.367c4.743-3.14,10.422-4.979,16.537-4.979c16.569,0,30,13.432,30,30s-13.431,30-30,30  c-6.113,0-11.793-1.838-16.535-4.978c0,0-13.464-11.133-13.464,26.367v48.611h48.611c37.5,0,26.367,13.463,26.367,13.463  c-3.14,4.743-4.979,10.422-4.979,16.537c0,16.568,13.432,30.001,30.001,30.001s30-13.433,30-30.001  c0-6.113-1.838-11.793-4.978-16.535c0,0-11.133-13.464,26.367-13.464H411v-48.611c0-37.5-13.466-26.367-13.466-26.367  c-4.742,3.14-10.422,4.978-16.534,4.978c-16.569,0-30-13.431-30-30S364.432,283.998,381,283.998z",
  "M480.999,243.723 c0-6.114,1.839-11.792,4.979-16.536  c0,0,11.133-13.463-26.367-13.463H411v48.611c0,37.5-13.464,26.367-13.464,26.367c-4.742-3.14-10.422-4.978-16.535-4.978  c-16.569,0-30,13.431-30,30c0,16.569,13.431,30.001,30,30.001c6.114,0,11.793-1.839,16.537-4.979c0,0,13.463-11.133,13.463,26.367  v48.611h48.611c37.5,0,26.367-13.463,26.367-13.463c-3.14-4.743-4.979-10.422-4.979-16.537c0-16.569,13.432-29.999,30.001-29.999  s30,13.43,30,29.999c0,6.113-1.838,11.793-4.978,16.535c0,0-11.133,13.464,26.367,13.464H611v-48.611  c0-37.5,13.463-26.367,13.463-26.367c4.743,3.14,10.422,4.979,16.536,4.979c16.568,0,30.001-13.432,30.001-30.001  c0-16.569-13.433-30-30.001-30c-6.112,0-11.793,1.838-16.535,4.978c0,0-13.464,11.133-13.464-26.367v-48.611h-48.611  c-37.5,0-26.367,13.466-26.367,13.466c3.14,4.742,4.978,10.422,4.978,16.534c0,16.569-13.431,30-30,30  S480.999,260.292,480.999,243.723z",
  "M741.001,443.723 c0-6.114-1.84-11.792-4.979-16.536  c0,0-11.133-13.463,26.367-13.463H811v-200h-48.611c-37.5,0-26.367-13.463-26.367-13.463c3.14-4.745,4.979-10.422,4.979-16.537  c0-16.569-13.432-29.999-30.001-29.999s-30,13.43-30,29.999c0,6.112,1.838,11.792,4.979,16.534c0,0,11.133,13.465-26.367,13.465H611  v48.611c0,37.5,13.463,26.367,13.463,26.367c4.742-3.14,10.422-4.979,16.536-4.979c16.569,0,30,13.432,30,30  c0,16.569-13.431,30-30,30c-6.114,0-11.794-1.838-16.536-4.978c0,0-13.463-11.133-13.463,26.367v48.611h48.611  c37.5,0,26.367,13.466,26.367,13.466c-3.141,4.742-4.979,10.422-4.979,16.534c0,16.569,13.431,30,30,30  S741.001,460.292,741.001,443.723z",

  "M80.999,384.003 c0,6.114,1.839,11.792,4.979,16.536  c0,0,11.133,13.463-26.367,13.463H11v199.998h48.611c37.5,0,26.367,13.466,26.367,13.466c-3.14,4.742-4.979,10.424-4.979,16.538  c0,16.569,13.432,29.997,30.001,29.997s30-13.428,30-29.997c0-6.114-1.838-11.796-4.978-16.538c0,0-11.133-13.466,26.367-13.466H211  v-48.61c0-37.5-13.463-26.367-13.463-26.367c-4.742,3.141-10.422,4.98-16.537,4.98c-16.569,0-30-13.434-30-30.003  c0-16.568,13.431-29.998,30-29.998c6.114,0,11.795,1.837,16.537,4.978c0,0,13.463,11.131,13.463-26.367v-48.611h-48.611  c-37.5,0-26.367-13.466-26.367-13.466c3.14-4.742,4.978-10.422,4.978-16.534c0-16.569-13.431-30-30-30  S80.999,367.434,80.999,384.003z",
  "M341.001,584.003 c0,6.114-1.839,11.79-4.979,16.537  c0,0-11.133,13.46,26.367,13.46H411v-48.611c0-37.5,13.464-26.367,13.464-26.367c4.742,3.142,10.422,4.98,16.535,4.98  c16.569,0,30-13.433,30-30.002s-13.431-30-30-30c-6.114,0-11.793,1.839-16.537,4.979c0,0-13.463,11.132-13.463-26.367v-48.611  h-48.611c-37.5,0-26.367,13.463-26.367,13.463c3.14,4.743,4.979,10.422,4.979,16.537C341.001,460.57,327.569,474,311,474  s-30-13.43-30-29.999c0-6.113,1.838-11.793,4.978-16.535c0,0,11.133-13.464-26.367-13.464H211v48.611  c0,37.499-13.463,26.367-13.463,26.367C192.794,485.84,187.115,484,181,484C164.433,484,151,497.431,151,514  s13.434,30.002,30.001,30.002c6.113,0,11.793-1.839,16.535-4.98c0,0,13.464-11.133,13.464,26.367V614h48.611  c37.5,0,26.367-13.466,26.367-13.466c-3.14-4.741-4.978-10.422-4.978-16.531c0-16.568,13.431-30.002,30-30.002  S341.001,567.435,341.001,584.003z",
  "M441,543.726 c-6.114,0-11.792-1.839-16.537-4.978  c0,0-13.463-11.133-13.463,26.367v48.61h48.611c37.5,0,26.367,13.464,26.367,13.464c-3.14,4.741-4.978,10.422-4.978,16.536  c0,16.569,13.431,29.997,30,29.997s30.001-13.428,30.001-29.997c0-6.114-1.839-11.795-4.979-16.536c0,0-11.133-13.464,26.367-13.464  H611v-48.61c0-37.5-13.463-26.367-13.463-26.367c-4.743,3.139-10.422,4.978-16.536,4.978c-16.569,0-30-13.431-30-30  c0-16.568,13.431-29.999,30-29.999c6.112,0,11.793,1.838,16.534,4.978c0,0,13.465,11.133,13.465-26.367v-48.611h-48.611  c-37.5,0-26.367-13.463-26.367-13.463c3.14-4.743,4.979-10.422,4.979-16.537c0-16.568-13.432-30.001-30.001-30.001  s-30,13.433-30,30.001c0,6.113,1.838,11.793,4.978,16.535c0,0,11.133,13.464-26.367,13.464H411v48.611  c0,37.5,13.466,26.367,13.466,26.367c4.742-3.14,10.422-4.978,16.534-4.978c16.569,0,30,13.431,30,29.999  C470.999,530.295,457.568,543.726,441,543.726z",
  "M741.001,583.999 c0,6.114-1.84,11.795-4.979,16.536  c0,0-11.133,13.466,26.367,13.466H811V414h-48.611c-37.5,0-26.367,13.463-26.367,13.463c3.14,4.743,4.979,10.422,4.979,16.537  c0,16.569-13.432,30-30.001,30s-30-13.431-30-30c0-6.113,1.838-11.793,4.979-16.535c0,0,11.133-13.464-26.367-13.464H611v48.611  c0,37.501-13.463,26.367-13.463,26.367c-4.743-3.14-10.422-4.979-16.536-4.979c-16.569,0-30,13.434-30,30.002  c0,16.569,13.431,29.997,30,29.997c6.112,0,11.793-1.837,16.534-4.975c0,0,13.465-11.133,13.465,26.367v48.61h48.611  c37.5,0,26.367-13.466,26.367-13.466c-3.141-4.741-4.979-10.422-4.979-16.536c0-16.569,13.431-29.997,30-29.997  S741.001,567.43,741.001,583.999z",

  "M11,814 h200 v-48.59 c0-37.5,13.463-26.367,13.463-26.367  c4.745,3.142,10.422,4.98,16.537,4.98c16.569,0,30-13.433,30-30.002c0-16.568-13.431-30.002-30-30.002  c-6.112,0-11.792,1.839-16.534,4.98c0,0-13.466,11.133-13.466-26.367V614h-47.917c-37.5,0-26.367,13.466-26.367,13.466  c3.14,4.741,4.978,10.422,4.978,16.531c0,16.568-13.43,30.002-30,30.002c-16.569,0-30-13.434-30-30.002  c0-6.114,1.839-11.79,4.979-16.537c0,0,11.133-13.46-26.367-13.46c-0.236,0-0.461,0-0.694,0H11V814z",
  "M241,744.002 c-6.114,0-11.792-1.839-16.537-4.98  c0,0-13.463-11.133-13.463,26.367V814h200v-48.611c0-37.5-13.463-26.367-13.463-26.367c-4.743,3.142-10.422,4.98-16.537,4.98  c-16.569,0-30-13.433-30-30.002s13.431-29.997,30-29.997c6.113,0,11.793,1.834,16.535,4.976c0,0,13.464,11.133,13.464-26.367V614  h-48.611c-37.5,0-26.367-13.46-26.367-13.46c3.14-4.745,4.979-10.423,4.979-16.537c0-16.568-13.432-30.002-30.001-30.002  s-30,13.434-30,30.002c0,6.112,1.838,11.792,4.978,16.534c0,0,11.133,13.463-26.367,13.463H211v48.611  c0,37.5,13.466,26.367,13.466,26.367c4.742-3.142,10.422-4.976,16.534-4.976c16.569,0,30,13.428,30,29.997  S257.568,744.002,241,744.002z",
  "M381,744.002 c6.114,0,11.793-1.839,16.537-4.98  c0,0,13.463-11.133,13.463,26.367V814h200v-48.611c0-37.5,13.463-26.367,13.463-26.367c4.743,3.142,10.422,4.98,16.536,4.98  c16.569,0,30-13.433,30-30.002s-13.431-29.997-30-29.997c-6.112,0-11.793,1.834-16.535,4.976c0,0-13.464,11.133-13.464-26.367V614  h-48.611c-37.5,0-26.367,13.466-26.367,13.466c3.14,4.741,4.979,10.422,4.979,16.536c0,16.569-13.432,29.997-30.001,29.997  s-30-13.428-30-29.997c0-6.114,1.838-11.795,4.978-16.536c0,0,11.133-13.466-26.367-13.466H411v48.611  c0,37.5-13.464,26.367-13.464,26.367c-4.742-3.142-10.422-4.976-16.535-4.976c-16.569,0-30,13.428-30,29.997  S364.432,744.002,381,744.002z",
  "M811,814 V614 h-48.59c-37.5,0-26.367-13.46-26.367-13.46  c3.141-4.747,4.979-10.423,4.979-16.537c0-16.568-13.432-30.002-30.001-30.002c-16.568,0-29.999,13.434-29.999,30.002  c0,6.109,1.838,11.79,4.978,16.531c0,0,11.133,13.466-26.367,13.466H611v47.917c0,37.5,13.464,26.367,13.464,26.367  c4.742-3.142,10.423-4.976,16.535-4.976c16.569,0,30,13.428,30,29.997s-13.431,30.002-30,30.002c-6.114,0-11.793-1.839-16.536-4.98  c0,0-13.463-11.133-13.463,26.367c0,0.233,0,0.461,0,0.694V814H811z",
];

function getRandom(items: number[]) {
  return items[Math.floor(Math.random() * items.length)];
}
const range = (start: number, stop: number, step = 1) =>
  Array(70)
    .fill(start)
    .map((x, y) => x + y * step);

function Piece(p: {
  onMove: (p: { x: number; y: number }) => void;
  idx: number;
  clip: string;
  shuffle: boolean;
  position: { x: number; y: number }[];
}) {
  const store = useStore();

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    clipPath: `path("${p.clip}")`,
    width: "820px",
    height: "820px",
  }));

  useEffect(() => {
    const startFrom = (-p.idx % 4) - 2;
    const pointsX = range(startFrom * 90, (7 - (p.idx % 4)) * 50, 15);
    const x = getRandom(pointsX);
    const y = Math.floor(p.idx / 4) * 50;
    api({
      x,
      y,
    });
  }, [p.shuffle]);

  const ref = useRef<HTMLImageElement | null>(null);

  const bind = useGesture({
    onDragEnd: () => {
      let x = style.x.get();
      let y = style.y.get();

      const left = p.position[p.idx - 1];
      const right = p.position[p.idx + 1];
      const top = p.position[p.idx - 4];
      const bot = p.position[p.idx + 4];

      if (Math.abs(x - left?.x) < 50 && Math.abs(y - left.y) < 50) {
        api({
          x: left.x,
          y: left.y,
        });
        return p.onMove({ x: left.x, y: left.y });
      } else {
        p.onMove({ x, y });
      }

      if (Math.abs(x - right?.x) < 50 && Math.abs(y - right.y) < 50) {
        api({
          x: right.x,
          y: right.y,
        });
        return p.onMove({ x: right.x, y: right.y });
      } else {
        p.onMove({ x, y });
      }

      if (Math.abs(x - top?.x) < 50 && Math.abs(y - top.y) < 50) {
        api({
          x: top.x,
          y: top.y,
        });
        return p.onMove({ x: top.x, y: top.y });
      } else {
        p.onMove({ x, y });
      }

      if (Math.abs(x - bot?.x) < 50 && Math.abs(y - bot.y) < 50) {
        api({
          x: bot.x,
          y: bot.y,
        });
        return p.onMove({ x: bot.x, y: bot.y });
      } else {
        p.onMove({ x, y });
      }
    },

    onDrag: (evt) => {
      if (!ref.current) return;
      let x = style.x.get();
      let y = style.y.get();
      const [dx, dy] = evt.delta;
      x += dx;
      y += dy;
      api.set({ x, y });
    },
  });

  return (
    <animated.img
      src={store.jigSawUrl}
      ref={ref}
      onDragStart={(e) => e.preventDefault()}
      {...bind()}
      className={clsx(
        " border hover:z-50  fixed w-full bg-no-repeat h-full top-0",
        {}
      )}
      style={style}
    ></animated.img>
  );
}

export default function JigSaw() {
  const [shuffle, setShuffle] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }[]>(
    Array(16).fill(undefined)
  );
  const store = useStore();

  const [_addReward] = useMutation(addReward, [
    `/api/inventory?epic=true`,
    `/api/items?scene=${store.scene}`,
  ]);

  useEffect(() => {
    const isDone = position.every((item) => item && item?.x === position[0]?.x);
    if (isDone) {
      store.setJigSaw(undefined);
      if (store.reward) {
        _addReward(store.reward);
        store.setReward(store.reward);
      }
    }
  }, [position]);

  return (
    <MiniGameWrapper status="JIGSAW">
      <button
        onClick={() => {
          setShuffle(!shuffle);
        }}
        className="border bg-white bg-opacity-5 px-4 py-2 m-5 text-xl font-bold rounded z-50 pointer-events-auto absolute text-gray-300 right-0 bottom-0"
      >
        shuffle
      </button>
      <div
        style={{
          width: "800px",
          height: "750px",
        }}
        className="grid grid-cols-4 w-full h-full"
      >
        {paths.map((d, idx) => (
          <Piece
            idx={idx}
            key={d}
            shuffle={shuffle}
            onMove={(p) => {
              const tmp = [...position];
              tmp[idx] = p;
              setPosition(tmp);
            }}
            position={position}
            clip={d}
          />
        ))}
      </div>
    </MiniGameWrapper>
  );
}
