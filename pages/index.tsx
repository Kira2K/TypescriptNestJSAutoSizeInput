import Head from "next/head";
// import TextArea from '../components/text-area'
import dynamic from "next/dynamic";
// import TextareaAutosize from 'react-textarea-autosize';
import styled from "@emotion/styled";
import React from "react";

type Maybe<T> = T | undefined | null;

interface MyProps {}
interface MyState {
  textareaRefs: Array<Maybe<HTMLTextAreaElement>>;
}
export default class Home extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      textareaRefs: [],
    };
  }

  DynamicComponentWithNoSSR = dynamic(() => import("../components/text-area"), {
    ssr: false,
  });

  Container = styled.div({
    padding: 50,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  });
  receiveRefFromTextArea = (ref: HTMLTextAreaElement): void => {
    this.state.textareaRefs.push(ref);
  };

  render() {
    return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <this.Container>
          <this.DynamicComponentWithNoSSR
            tabIndex={1}
            labelValue={"Name of Meeting"}
            sendRefToParent={(ref: HTMLTextAreaElement) =>
              this.receiveRefFromTextArea(ref)
            }
          />
          <this.DynamicComponentWithNoSSR
            tabIndex={2}
            labelValue={"Location / Call"}
            defaultValue={"Do you like this дефолтное значение?"}
            sendRefToParent={(ref: HTMLTextAreaElement) =>
              this.receiveRefFromTextArea(ref)
            }
          />
          <this.DynamicComponentWithNoSSR
            tabIndex={3}
            labelValue={"Agenda"}
            sendRefToParent={(ref: HTMLTextAreaElement) =>
              this.receiveRefFromTextArea(ref)
            }
          />
        </this.Container>
      </div>
    );
  }
}
