export default function Celula({ letra, status }) {
  return <div className={`celula ${status}`}>{letra}</div>;
}
