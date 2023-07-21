import styled from 'styled-components';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;

//Colors
export const Colors = {
  primary: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#1F2937',
  darkLight: '#9CA3AF',
  brand: '#345fb4',
  green: '#10B981',
  red: '#E32845',
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  background-color: ${brand};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;
export const PageLogo = styled.Image`
  width: 250px;
  height: 200px;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding: 10px;
`;

export const SubTitle = styled.Text`
  font-size: 15px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;

export const StyledFormArea = styled.View`
  flex: 3;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 30px 20px;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color :${tertiary};
    font-size:13px;
    text-align:left;

`;
export const LeftIcon = styled.View`
  left: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;
export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;
export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${brand};
  border-radius: 5px;
  justify-content: center;
  align-items:center;
  margin-vertical: 5px;
  height: 60px;

  ${(props) => props.google === true && `
  background-color:${green};
  flex-direction:row;
  justify-content:center;
  align-items:center;
  `}
`;
export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 16px;

  ${(props) => props.google === true && `
     padding:5px;
    `}
`;
export const MsgBox = styled.Text`
text-align:center;
font-size:13px;
`;
export const Line = styled.View`
height:1px;
width:100%;
background-color:${darkLight};
margin-vertical:10px;
`;
export const ExtraView = styled.View`
    justify-content:center;
    flex-direction:row;
    align-items:center;
    padding:10px;
`;
export const ExtraText = styled.Text`
    justify-content:center;
    align-content:center;
    color:${tertiary};
    font-size:15px;
`;
export const TextLink = styled.TouchableOpacity`
justify-content:center;
align-items:center;
`;
export const TextLinkContent = styled.Text`
color:${brand};
font-size:15px;
`;
