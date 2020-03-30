import React from "react";

import { useLocation, Link } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Stores() {
  const query = useQuery();

  return (
    <div>
      <div>{`lat : ${query.get("lat")} long : ${query.get("long")}`}</div>
      <Link to={`/`}>Go to Home </Link>
    </div>
  );
}

export default Stores;
