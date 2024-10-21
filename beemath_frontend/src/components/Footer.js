import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Left = styled.div`
  flex: 30%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;
const Right = styled.div`
  flex: 30%;
  flex-direction: column;
  padding: 20px;
  display: flex;
`;
const Center = styled.div`
  flex: 30%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const SocialContainer = styled.div`
  display: flex;
`;

const SocialIcon = styled.div`
  width: 35px;
  height: 35px;
  color: white;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  align-items: center;
  justify-content: center;
  display: flex;
  margin-right: 6px;
  cursor: pointer;
`;

const Desc = styled.h3`
  font-size: 17px;
  font-weight: bold;
  margin: 10px 0px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;
const FootItem = styled.div`
  font-size: 15px;
`;

const ListItem = styled.li`
  width: 50%;
`;

const Container = styled.div`
  margin-top: 70px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  background-color: grey;
  color: black;
  @media screen and (max-width: 600px) {
    justify-content: flex-start;

    ${Left} {
      padding: 5px;
      justify-content: flex-start;
      flex: 20%;
    }
    ${Right} {
      padding: 5px;
      justify-content: flex-start;
      flex: 40%;
    }
    ${Center} {
      padding: 5px;
      justify-content: flex-start;
      flex: 20%;
    }
    ${Desc} {
      font-size: 14px;
    }
    ${List} {
      font-size: 12px;
    }
    ${SocialIcon} {
      width: 28px;
      height: 28px;
    }
    ${FootItem} {
      font-size: 12px;
    }
  }
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Desc>Customer</Desc>
        <FootItem>
          <Link className="nav-link" to="/contact">
            Contact us
          </Link>
        </FootItem>
        <FootItem>
          <Link className="nav-link" to="/">
            FAQs
          </Link>
        </FootItem>
      </Left>
      <Center>
        <Desc>Beemathworld</Desc>
        <FootItem>
          <Link className="nav-link" to="/about-us">
            About us
          </Link>
        </FootItem>
        <SocialContainer>
          <SocialIcon color="#55ACEE">
            <TwitterIcon />
          </SocialIcon>
          <SocialIcon color="#E4405F">
            <a
              style={{ color: "white" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/beemathworld"
            >
              <InstagramIcon />
            </a>
          </SocialIcon>
        </SocialContainer>
      </Center>
      <Right>
        <Desc>Categories</Desc>
        <List>
          <ListItem>
            <Link
              className="nav-link"
              to={{ pathname: "/products-category/kitchen" }}
            >
              Kitchen-utensils
            </Link>
          </ListItem>
          <ListItem>
            <Link
              className="nav-link"
              to={{ pathname: "/products-category/tracker" }}
            >
              Trackers
            </Link>
          </ListItem>
          <ListItem>
            <Link
              className="nav-link"
              to={{ pathname: "/products-category/bathroom" }}
            >
              Bathroom
            </Link>
          </ListItem>
          <ListItem>
            <Link
              className="nav-link"
              to={{ pathname: "/products-category/electronics" }}
            >
              Electronics
            </Link>
          </ListItem>
          <ListItem>
            <Link
              className="nav-link"
              to={{ pathname: "/products-category/household-accessories" }}
            >
              Household
            </Link>
          </ListItem>
        </List>
      </Right>
    </Container>
  );
};

export default Footer;
