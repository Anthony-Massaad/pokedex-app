import React from "react";
import common from "../data/common";

const Footer = () => {
  return (
    <footer>
      <div className="blocky" id="copyright-container">
        <div className="blocky container display-flex-center">
          {common.footer.copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
