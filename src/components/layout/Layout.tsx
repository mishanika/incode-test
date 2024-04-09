import Flex from "antd/lib/flex";
import AntLayout from "antd/lib/layout";
import Input from "../input/Input";
import Path from "../path/Path";
import Issues from "../issues/Issues";

const Layout: React.FC = () => {
  return (
    <AntLayout data-testid="layout-component" style={{ padding: "25px", alignItems: "center" }}>
      <Flex align="center" vertical style={{ minWidth: "1000px", width: "60%", overflow: "auto" }}>
        <Input />
        <Path />
        <Issues />
      </Flex>
    </AntLayout>
  );
};

export default Layout;
