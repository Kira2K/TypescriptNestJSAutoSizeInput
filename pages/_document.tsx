import Document, { DocumentContext,Html, Head, Main, NextScript } from 'next/document'
import styled from '@emotion/styled'
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }
   Body = styled.body(
    {
      backgroundColor: 'black', 
      width:'100%',
      height:'100%'
    },

  )

  render() {
    return (
      <Html>
        <Head />
        <this.Body>
          <Main />
          <NextScript />
        </this.Body>
      </Html>
    )
  }
}

export default MyDocument