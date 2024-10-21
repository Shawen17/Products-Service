import React from "react";
import styled from "styled-components";

const Header = styled.h5`
  font-size: 24px;
  color: #18a558;
  text-decoration-line: underline;
  text-decoration-color: #18a558;
  text-decoration-thickness: 2px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/about-us.jpg");
  background-size: cover;
  width: 100%;
  height: 150px;
`;

const Container = styled.div`
  margin: 110px 5px 20px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media screen and (max-width: 600px) {
    ${Header} {
      font-size: 15px;
    }
  }
`;

const MessageHeader = styled.h1`
  width: 200px;
  word-break: break-word;
  display: flex;
  font-weight: bolder;
  align-items: flex-start;
  justify-content: flex-start;
  text-transform: uppercase;
  font-family: "Urbanist", sans-serif;
  color: #18a558;
  margin-bottom: 20px;
`;

const Message = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  word-break: break-word;
  width: 50%;
`;

const Image = styled.img`
  height: 300px;
  width: 30%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 8px;
`;

const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 40px 20px 40px;
  align-items: center;
  justify-content: space-around;

  @media screen and (max-width: 768px) {
    margin: 5px 20px 5px 20px;
    flex-direction: column-reverse;
    ${Image} {
      width: 100%;
    }
    ${Message} {
      width: 80%;
    }
    ${MessageHeader} {
      width: 130px;
    }
  }
`;

const AboutUs = () => {
  document.title = "about-us";

  return (
    <Container>
      <Header>About Us</Header>
      <Body>
        <Image src="/appliances.jpg" alt="poster" />
        <Message>
          <MessageHeader>That Soft life</MessageHeader>
          <p>
            Beemathworld is the home of amazing smart everyday household gadgets
            ranging from kitchen, sitting room, bathroom and electronic gadgets
            in general. We have varieties of items that will make your everyday
            life easy. From aesthetics of your home, ease of cooking in your
            kitchen, smart items your kids can play and learn with to selfcare
            gadgets that will make your rough day a smooth sailing one, we offer
            this and more.
          </p>
        </Message>
      </Body>
      <div>
        <div
          style={{ width: 250, textAlign: "center", wordBreak: "break-word" }}
        >
          Check us out regularly to get new products with the latest
          technology.We offer both wholesale and retail and we deilver
          everywhere as our logistics team is well grounded to make this
          possible{" "}
          <span
            style={{ fontSize: 24, fontWeight: "bolder", color: "#18a558" }}
          >
            !!
          </span>
        </div>
      </div>
    </Container>
  );
};

export default AboutUs;
