type Props = {
  name: string;
  location: string;
  category: string;
  tag: string[];
};

export default function Company(props: Props) {
  return (
    <div className="px-6 py-4 border bg-white rounded-xl w-[calc(50%-1rem)] max-w-[90dvw]"></div>
  );
}
