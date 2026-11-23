import CloseIcon from "@/assets/icons/close.svg";

export default function ItemList({ items, getLabel, getMeta, onRemove, label }) {
  if (items.length === 0) return null;

  return (
    <ul className="item-list" aria-label={label}>
      {items.map((item, index) => (
        <li key={`${getLabel(item)}-${index}`} className="item-list-row">
          <span className="item-list-text">
            <span className="item-list-label">{getLabel(item)}</span>
            {getMeta && <span className="item-list-meta">{getMeta(item)}</span>}
          </span>
          <button
            type="button"
            className="item-list-remove"
            onClick={() => onRemove(index)}
            aria-label={`Quitar ${getLabel(item)}`}
          >
            <img src={CloseIcon} alt="" />
          </button>
        </li>
      ))}
    </ul>
  );
}
