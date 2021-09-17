import Colophon from '../components/Colophon';

export default function Photos() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Colophon />
      <div className="relative w-full flex-auto text-center p-4">
        Loading albums&hellip;
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          height="100%"
          src="https://airtable.com/embed/shrDFa0a0ErGTsqAr?backgroundColor=gray"
          title="Photo albums"
          width="100%"></iframe>
      </div>
    </div>
  );
}
