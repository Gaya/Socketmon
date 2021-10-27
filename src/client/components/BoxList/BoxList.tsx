import { FunctionComponent } from 'preact';

interface BoxListProps {
  title: string;
}

const BoxList: FunctionComponent<BoxListProps> = ({ children, title }) => (
  <div className="shadow overflow-hidden border-b border-gray-200 rounded-md divide-y divide-gray-200">
    <h2 className="bg-gray-50 py-2 px-3 bg-gray-200 text-gray-700">
      {title}
    </h2>
    <div className="bg-white divide-y divide-gray-200">
      {children}
    </div>
  </div>
);

export default BoxList;
