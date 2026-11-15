type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  titleId?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
}: SectionHeadingProps) {
  return (
    <div className="hnl-section-heading">
      <div>
        <p className="hnl-eyebrow">{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
        {description ? <p className="hnl-section-description">{description}</p> : null}
      </div>
    </div>
  );
}
