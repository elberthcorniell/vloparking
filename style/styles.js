import { StyleSheet, Dimensions } from 'react-native'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const DARK_BLUE = '#ff4040' /*'#1a2c50'*/
const LIGHT_BLUE = '#5b86e5'
const LIGHT_GRAY = '#f3f5f7'


const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: screenHeight,
    width: screenWidth
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  Title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    position: 'absolute',
    top: 10,
    left: 10
  },
  blueTitle: {
    color: DARK_BLUE,
    fontSize: 38,
    fontWeight: "bold",
    textAlign: 'left',
    width: screenWidth,
    padding: 20
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  Button: {
    backgroundColor: DARK_BLUE,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 50,
    zIndex: 1
  },
  input: {
    backgroundColor: LIGHT_GRAY,
    width: screenWidth - 40,
    height: 50,
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 20,
    fontWeight: "bold"
  },
  buttonBlue: {
    backgroundColor: DARK_BLUE,
    width: screenWidth - 40,
    height: 50,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  buttonBlueLight: {
    backgroundColor: LIGHT_BLUE,
    width: screenWidth - 20,
    height: 50,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: "bold"
  },
  modalView: {
    height: screenHeight * 0.90,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: screenWidth,
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 20
  },
  buttonBlueText: {
    color: 'white',
    fontWeight: "500"
  },
  buttonBlueM: {
    backgroundColor: 'blue',
    width: screenWidth - 80,
    height: 50,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  mapContainer: {
    width: screenWidth,
    height: screenHeight * 0.6,
    borderRadius: 5,
   },
  QR: {
    width: screenWidth,
    height: screenHeight,
    marginTop: -80
  },
  qrContainer: {
    width: screenWidth - 40,
    height: screenWidth -40,
    overflow: 'hidden',
    borderRadius: 5,
    padding: -100,
    marginTop: 10
  }
});

module.exports = { styles }