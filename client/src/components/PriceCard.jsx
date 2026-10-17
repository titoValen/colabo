export default function PriceCard({
  title,
  price,
  period,
  description,
  button,
  featuresIntro = "Todo lo que trae free:",
  features,
  className = "",
}) {
  return (
    <article className={`price-card ${className}`.trim()}>
      <h2 className="price-card-title">{title}</h2>
      <div className="price-value">
        <span className="price-currency">$</span>
        <span className="price-amount">{price}</span>
        {period && <span className="price-period">{period}</span>}
      </div>
      <p className="price-description">{description}</p>
      <button className="price-action" type="button">
        {button}
      </button>
      <p className="price-features-intro">{featuresIntro}</p>
      <ul className="price-features">
        {features.map((feature) => (
          <li className="price-feature" key={feature}>
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
