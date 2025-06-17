import React from 'react';
import gazpromLogo from '../images/gazprom.png'
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-x: hidden;
  }
`;

const Background = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(270deg, #89f7fe, #66a6ff);
  background-size: 600% 600%;
  animation: gradientShift 15s ease infinite;
  z-index: -1;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Container = styled.div`
  padding: 50px 20px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.h1`
  text-align: center;
  color: #0b3d91;
  margin-bottom: 30px;
  font-size: 3em;
  font-weight: bold;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Logo = styled.img`
  max-width: 100px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  animation: fadeInRotate 4s forwards;
  margin-bottom: 10px;

  @keyframes fadeInRotate {
    0% {
      opacity: 0;
      transform: rotate(0deg) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: rotate(360deg) scale(1);
    }
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const Section = styled.section`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  color: #0b3d91;
  margin-bottom: 15px;
  border-bottom: 2px solid #0b3d91;
  display: inline-block;
  padding-bottom: 5px;
`;

const Paragraph = styled.p`
  font-size: 1.1em;
  margin-bottom: 20px;
  line-height: 1.6; 
  text-align: justify
`;

const List = styled.ul`
  list-style-type: square;
  padding-left: 20px;
  font-size: 1.1em;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const Contacts = styled.p`
  font-size: 1.1em;
  margin-top: 10px;
  margin-bottom: 20px;
  line-height: 1.6;
  text-align: justify;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
`;

const SourceLink = styled.a`
  display: inline-block;
  margin-right: 15px;
  font-size: 1em;
  color: #0b3d91;
  text-decoration: none;
  transition: color 0.3s, transform 0.3s;

  &:hover {
    color: #095a8b;
    transform: translateY(-2px);
  }
`;
const ProjectLink = styled.a`
  display: block;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #e0f0ff;
  color: #0b3d91;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c0e0ff;
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(11, 61, 145, 0.2);
  }
`;

const Gazprom = () => {
  return (
    <>
      <GlobalStyle />
      <Background />
      <Container>
        <Header>Газпром — ведущая энергетическая компания</Header>
        <LogoWrapper>
          <Logo src={gazpromLogo} alt="Газпром логотип" />
        </LogoWrapper>
        <Section>
          <SectionTitle>О компании</SectionTitle>
          <Paragraph>
            <strong>«Газпром»</strong> — крупнейшая газовая компания в мире, осуществляющая добычу, транспортировку и сбыт природного газа. Мы стремимся обеспечивать надежность и безопасность энергетических ресурсов для наших клиентов.
          </Paragraph>
          <Paragraph>
            Наша миссия — развитие энергетического сектора, внедрение инновационных технологий и забота об экологической безопасности.
          </Paragraph>
        </Section>
        <Section>
          <SectionTitle>Наши проекты</SectionTitle>
          <List>
            <ListItem>
              <ProjectLink href="https://www.gazprom.ru/about/production/transportation/" target="_blank" rel="noopener noreferrer">
                Развитие газотранспортной системы
              </ProjectLink>
            </ListItem>
            <ListItem>
              <ProjectLink href="https://www.gazprom.ru/about/strategy/innovation/" target="_blank" rel="noopener noreferrer">
                Инновационные технологии добычи
              </ProjectLink>
            </ListItem>
            <ListItem>
              <ProjectLink href="https://www.gazprom.ru/sustainability/environmental-protection/ems/" target="_blank" rel="noopener noreferrer">
                Экологические инициативы
              </ProjectLink>
            </ListItem>
            <ListItem>
              <ProjectLink href="https://sustainability.gazpromreport.ru/2022/about-gazprom/international-activity/" target="_blank" rel="noopener noreferrer">
                Международное сотрудничество
              </ProjectLink>
            </ListItem>
          </List>
        </Section>
        <Section>
          <SectionTitle>Контакты</SectionTitle>
          <Contacts>
            Телефон: +74822522758 <br />
            Электронная почта: info@tver-gaz.ru <br />
            Адрес: 170026, Тверь, ул.Фурманова, 12/4
          </Contacts>
        </Section>
        <Section>
          <SectionTitle>Дополнительные ресурсы</SectionTitle>
          <LinksContainer>
            <SourceLink href="https://www.gazprom.com/" target="_blank" rel="noopener noreferrer">
              Официальный сайт Газпрома
            </SourceLink>
            <SourceLink href="https://vk.com/gazprom" target="_blank" rel="noopener noreferrer">
              Сообщество ВКонтакте
            </SourceLink>
          </LinksContainer>
        </Section>
      </Container>
    </>
  );
};
export default Gazprom;