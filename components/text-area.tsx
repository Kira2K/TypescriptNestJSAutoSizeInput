import React, { useContext, useEffect, useState, Ref, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styled from "@emotion/styled";
import { Spring, animated, Controller } from "react-spring";
// TYPESITION REGION
type Maybe<T> = T | undefined | null;

interface TextAreaArg {
  defaultValue?: Maybe<string>;
  labelValue: string;
  sendRefToParent: (ref: HTMLTextAreaElement) => void;
  tabIndex: number;
}

type labelPosition = {
  top: number;
  bottom: number;
};
enum LabelFontSize {
  big = 24,
  small = 12,
}
interface MyState extends TextAreaArg {
  focusedColor: string;
  textareaFontSize: string;
  labelFontSize: number;
  labelPosition: labelPosition;
  lineMaxWidth: number;
}
interface MyProps extends TextAreaArg {}

export default class TextArea extends React.Component<MyProps, MyState> {
  constructor(props: TextAreaArg) {
    super(props);
    this.state = {
      tabIndex: props.tabIndex,
      sendRefToParent: props.sendRefToParent,
      defaultValue: props.defaultValue,
      labelValue: props.labelValue,
      lineMaxWidth: TextArea.isStringLongerThen40(props.defaultValue)
        ? 200
        : 300,
      focusedColor: "grey",
      textareaFontSize: TextArea.isStringLongerThen40(props.defaultValue)
        ? "14px"
        : "22px",

      labelFontSize: props.defaultValue
        ? LabelFontSize.small
        : LabelFontSize.big,
      labelPosition: {
        top: props.defaultValue ? 30 : 0,
        bottom: props.defaultValue ? 0 : 40,
      },
    };
  }
  static isStringLongerThen40 = (string: string): boolean => {
    if (!string || string.length < 40) return false;
    else if (string.length >= 40) return true;
  };

  componentDidMount() {
    const global = this;
    document.onkeydown = function (evt) {
      if (evt.key == "Escape" || evt.code == "Escape") global.handleBlur();
    };
  }

  // CREATION REGION
  Wrapper = () => {
    return styled.div({
      border: 0,
      boxSizing: "border-box",
      backgroundColor: "black",
      position: "relative",
      marginBottom: 50,
    });
  };

  textarea: HTMLTextAreaElement;
  BasicTextareaAutosize = ({ className }) => {
    return (
      <TextareaAutosize
        ref={(tag) => {
          if (tag) this.textarea = tag;
        }}
        className={className}
        defaultValue={this.state.defaultValue}
        onHeightChange={(height, rowNumber) =>
          this.adjustLabel({ height, rowHeight: rowNumber.rowHeight })
        }
        onFocus={() => this.handleFocus()}
        onChange={(e) => this.handleChange(e)}
        onBlur={() => this.handleBlur()}
      />
    );
  };

  StyledTextareaAutosize = () => {
    return styled(this.BasicTextareaAutosize)`
      background-color: transparent;
      border: 0;
      color: white;
      margin: 0px;
      resize: none;
      overflow: hidden;
      z-index: 2;
      position: relative;
      font-size: ${this.state.textareaFontSize};
      transition: all 0.15s ease;
      :after,
      :before {
        display: none;
      }
      :focus,
      :active {
        outline: none;
        border: none;
      }
    `;
  };

  line: HTMLHRElement;
  Line = () => {
    return styled.hr({
      boxSizing: "border-box",
      backgroundColor: this.state.focusedColor,
      color: this.state.focusedColor,
      width: this.state.lineMaxWidth,
      margin: 0,
      borderColor: this.state.focusedColor,
    });
  };

  Label = () => {
    return styled(animated.div)({
      color: "grey",
      fontFamily: "Roboto, sans-serif",
      fontSize: this.state.labelFontSize,
      marginLeft: 2,
      position: "absolute",
      top: this.state.labelPosition.top,
      bottom: this.state.labelPosition.bottom,
    });
  };

  // METHODS REGION
  isFocused: boolean = false;
  handleFocus = (): void => {
    if (!this.isFocused) {
      this.textarea.focus();
      this.state.sendRefToParent(this.textarea);
      this.moveLabelOnFocusChange();
      this.isFocused = true;
    }
  };

  handleBlur = (): void => {
    if (this.isFocused && this.textarea.value == "") {
      this.moveLabelOnFocusChange();
      this.textarea.blur();
      this.isFocused = false;
    }
  };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    if (TextArea.isStringLongerThen40(value)) {
      if (e.target.style.fontSize != "14px")
        // FIXME: logically, i should call ` setState() `
        // here, but it doesn't work properly, causing element rerendering and values loosing
        e.target.style.fontSize = "14px";
      // this.setState({
      //   textareaFontSize: '14px'
      // })

      if (this.line.style.width != "200px") {
        // this.setState({
        //   lineMaxWidth: 200,
        // });
        this.line.style.width = "200px";
      }
    } else if (
      !TextArea.isStringLongerThen40(value) &&
      e.target.style.fontSize != "22px"
    ) {
      // this.setState({
      //   textareaFontSize: '22px'
      // })
      e.target.style.fontSize = "22px";

      if (this.line.style.width != "300px") {
        // this.setState({
        //   lineMaxWidth: 300,
        // });
        this.line.style.width = "300px";
      }
    }
  };

  label: HTMLDivElement;
  adjustLabel = ({
    height,
    rowHeight,
  }: {
    height: number;
    rowHeight: number;
  }) => {
    console.log({ height, rowHeight });
    const top = this.state.labelPosition.top;
    const additionalFontSizeNumber = this.textarea?.value.length < 40 ? 0 : 10;
    const newHeight = top + height - rowHeight - additionalFontSizeNumber;
    // Got to FIXME to check this logic
    if (this.label) this.label.style.top = newHeight.toString() + "px";
  };

  moveLabelOnFocusChange = () => {
    // focus
    if (!this.isFocused) {
      return this.setState({
        labelPosition: {
          top: 40,
          bottom: 0,
        },
        labelFontSize: LabelFontSize.small,
        focusedColor: "white",
      });
    }
    // blur
    this.setState({
      focusedColor: "grey",
      labelFontSize: LabelFontSize.big,
      labelPosition: {
        top: 0,
        bottom: 30,
      },
    });
  };

  animations = new Controller({ opacity: 0 });
  render() {
    const Wrapper = this.Wrapper();
    const StyledTextareaAutosize = this.StyledTextareaAutosize();
    const Label = this.Label();
    const Line = this.Line();

    return (
      <Wrapper tabIndex={this.state.tabIndex}>
        <StyledTextareaAutosize className="StyledTextareaAutosize" />

        <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} delay={150}>
          {(props) => (
            <Label
              style={props}
              ref={(tag) => {
                if (tag) this.label = tag;
              }}
            >
              {this.state.labelValue}
            </Label>
          )}
        </Spring>

        <Line
          ref={(tag) => {
            if (tag) this.line = tag;
          }}
        />
      </Wrapper>
    );
  }
}
