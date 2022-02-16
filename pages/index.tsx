import type { NextPage } from "next";
import Head from "next/head";
import Menu from "../components/Menu";
import Scenes from "../components/Scenes";
import Ui from "../components/Ui";
import Viewer from "../components/Viewer";
import _Viewer from "../components/Viewer/index copy";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Ui time={30} />
      <Menu />
      <Viewer />
      <Scenes />
    </div>
  );
};

export default Home;
