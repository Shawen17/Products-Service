import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin-top: 110px;

  @media screen and (max-width: 768px) {
    height: 60vh;
    ${Wrapper} {
      height: 100%;
    }
  }
`;

const Title = styled.h1`
  font-size: 70px;
`;
const Desc = styled.p`
  margin: 50px 0px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;
`;
const Button = styled.button`
  padding: 10px;
  font-size: 20px;
  background-color: white;
  cursor: pointer;
`;

const ImgContainer = styled.div`
  height: 100%;
  flex: 50%;
`;
const InfoContainer = styled.div`
  flex: 50%;
  height: 100%;
  width: 100%;
  padding: 35px;
  background-color: black;
  color: white;
`;
const Image = styled.img`
  height: 100%;
  width: 100%;
`;

const Slide = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    ${Title} {
      font-size: 40px;
    }
    ${Desc} {
      margin: 20px 0px;
      font-size: 14px;
      letter-spacing: 1px;
    }
    ${Button} {
      font-size: 14px;
      padding: 5px;
    }
    ${ImgContainer} {
      flex: 100%;
      height: 50%;
    }
    ${InfoContainer} {
      flex: 0%;
      height: 0%;
      width: 0%;
    }
  }
`;

const Slider = () => {
  const navigate = useNavigate();

  const HandleClick = () => {
    navigate("/products");
  };

  return (
    <Container>
      <Wrapper className="wrapper">
        <Slide className="pic" id="pic4">
          <ImgContainer>
            <Image src="/Web Carousel1-1.jpg" alt="slide" />
          </ImgContainer>
          <InfoContainer color="black">
            <Title>HOME OF EASY LIFE GADGETS</Title>
            <Desc>
              FOR THAT SOFT LIFE JOURNEY, WE HAVE DIFFERENT AMAZING GADGETS TO
              TAKE YOU THERE!
            </Desc>
          </InfoContainer>
        </Slide>
        <Slide className="pic" id="pic3">
          <ImgContainer>
            <Image src="/Web Carousel2-2.jpg" alt="slide" />
          </ImgContainer>
          <InfoContainer color="white">
            <Title>KITCHEN GADGETS</Title>
            <Desc>
              FOR THAT SOFT LIFE JOURNEY, WE HAVE DIFFERENT AMAZING GADGETS TO
              TAKE YOU THERE!
            </Desc>
            <Button onClick={HandleClick}>SHOP NOW</Button>
          </InfoContainer>
        </Slide>
        <Slide className="pic" id="pic2">
          <ImgContainer>
            <Image src="/Web Carousel3-1.jpg" alt="slide" />
          </ImgContainer>
          <InfoContainer color="black">
            <Title>SELFCARE GADGETS</Title>
            <Desc>
              FOR THAT SOFT LIFE JOURNEY, WE HAVE DIFFERENT AMAZING GADGETS TO
              TAKE YOU THERE!
            </Desc>
          </InfoContainer>
        </Slide>
        <Slide className="pic" id="pic1">
          <ImgContainer>
            <Image src="/Web Carousel4-1.jpg" alt="slide" />
          </ImgContainer>
          <InfoContainer color="black">
            <Title>BATHROOM GADGETS</Title>
            <Desc>
              FOR THAT SOFT LIFE JOURNEY, WE HAVE DIFFERENT AMAZING GADGETS TO
              TAKE YOU THERE!
            </Desc>
            <Button onClick={HandleClick}>SHOP NOW</Button>
          </InfoContainer>
        </Slide>
      </Wrapper>
    </Container>
  );
};

export default Slider;
