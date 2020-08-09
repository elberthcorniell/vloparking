import { StyleSheet, Dimensions } from 'react-native'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

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
    color: '#5b86e5',
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
    backgroundColor: '#5b86e5',
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
    backgroundColor: '#f3f5f7',
    width: screenWidth - 20,
    height: 50,
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 20,
    fontWeight: "500"
  },
  buttonBlue: {
    backgroundColor: '#1a2c50',
    width: screenWidth - 20,
    height: 50,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
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
    height: screenHeight + 40,
    position: 'absolute',
    zIndex: -1
  },
  QR: {
    width: screenWidth,
    height: screenHeight,
    marginTop: -80
  },
  qrContainer: {
    width: screenWidth - 20,
    height: screenWidth * 1.3,
    overflow: 'hidden',
    borderRadius: 40,
    padding: -100,
    marginTop: 10
  }
});

module.exports = { styles }