import PropertyListing from "./property";

 export const Home: React.FC = () => {
  
  return (
    <>
      <div className="w-full py-10 px-2">
        <h1 className="text-xl font-bold mr-4 mx-24 ">Search Properties for Rent</h1>
        <PropertyListing />
      </div>
    </>
  );
};
