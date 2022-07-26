import { useState } from "react";

import clsx from "clsx";

type GameBoardProps = {
  tiles: Tile[];
  size: {
    width: number;
    height: number;
  };
};

type Tile = {
  task: string;
  points: number;
  status: string;
};

export const GameBoard = ({ tiles: initialTiles, size }: GameBoardProps) => {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [targetTile, setTargetTile] = useState<number | null>(null);
  const [editTileId, setEditTileId] = useState<number | null>(null);

  return (
    <div className="grid place-items-center overflow-hidden rounded-lg p-px">
      <label htmlFor="tile-edit-modal" className="w-full max-w-[70vh]">
        <ul
          className="relative grid w-full max-w-[70vh] gap-px overflow-hidden rounded-[7px] border border-base-content bg-base-content"
          style={{
            gridTemplateColumns: `repeat(${size.width}, 1fr)`,
          }}
          onDragStart={(e) => {
            if (!(e.target instanceof HTMLElement)) return;
            // get the 'tile' itself
            const targetTileEl = e.target.closest(".tile");

            // without a target tile, we can't do much
            if (!targetTileEl || !(targetTileEl instanceof HTMLElement)) return;
            // center the drag image
            e.dataTransfer.setDragImage(
              targetTileEl,
              e.nativeEvent.offsetX,
              e.nativeEvent.offsetY
            );

            // Alternate drag image setup
            // using closest label element will center the drag image
            // const targetImage = e.target.closest("label");
            // if (targetImage && targetImage instanceof HTMLElement) {
            //   e.dataTransfer.setDragImage(targetTile, 0, 0);
            // }

            e.dataTransfer.effectAllowed = "move";

            if (targetTileEl) {
              setSelectedTile(Number(targetTileEl.dataset.tile));
            }
          }}
          onDragEnter={(e) => {
            if (!(e.target instanceof HTMLElement)) return;
            e.dataTransfer.dropEffect = "move";
            const targetTile = e.target.closest("li");
            if (targetTile) {
              setTargetTile(Number(targetTile.dataset.tile));
            }
          }}
          onDragEnd={(e) => {
            if (
              selectedTile === null ||
              targetTile === null ||
              Number.isNaN(selectedTile) ||
              Number.isNaN(targetTile) ||
              selectedTile === targetTile
            ) {
              setSelectedTile(null);
              setTargetTile(null);
              return;
            }
            setTiles((t) => {
              const newTiles = [...t];
              const tempTile = newTiles[selectedTile];
              newTiles[selectedTile] = newTiles[targetTile];
              newTiles[targetTile] = tempTile;
              return newTiles;
            });
            setSelectedTile(null);
            setTargetTile(null);
          }}
        >
          {tiles.map((tile, index) => (
            <li
              data-tile={index}
              key={tile.task}
              draggable
              tabIndex={0}
              onClick={() => setEditTileId(index)}
              className={clsx(
                "tile",
                // The z-index is necessary to ensure the drag image does not include parent
                "relative z-0 grid aspect-square cursor-grab select-none place-items-center bg-base-100 transition-all hover:bg-base-100/80",
                "after:absolute after:inset-0 after:h-3 after:w-3 after:opacity-0"
                // index === selectedTile && "after:bg-red-300 after:opacity-100",
                // index === targetTile && "after:bg-blue-300 after:opacity-100"
                // index === editTileId && "bg-info/50"
              )}
            >
              {tile.task}
            </li>
          ))}

          <input
            type="checkbox"
            id="tile-edit-modal"
            className="modal-toggle"
          />
          <label className="modal" htmlFor="">
            <div className="modal-box relative">
              <label
                htmlFor="tile-edit-modal"
                className="btn btn-circle btn-sm absolute right-2 top-2"
                onClick={() => setEditTileId(null)}
              >
                ✕
              </label>
              <h3 className="text-lg font-bold">
                Here's where the task edit page would be...
              </h3>
              <p className="py-4">{`If we had one! (index: ${editTileId})`}</p>
              <p className="py-4">
                {editTileId && tiles[editTileId]
                  ? JSON.stringify(tiles[editTileId])
                  : editTileId}
              </p>
            </div>
          </label>
        </ul>
      </label>
    </div>
  );
};
