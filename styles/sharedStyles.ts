import { StyleSheet } from 'react-native';

export default StyleSheet.create({
 button: {
   backgroundColor: '#1976d2',
   paddingVertical: 12,
   paddingHorizontal: 32,
   borderRadius: 8,
   alignItems: 'center',
   marginBottom: 10,
 },
 buttonText: {
   color: '#fff',
   fontWeight: 'bold',
   fontSize: 16,
 },
 input: {
   width: '100%',
   height: 40,
   borderColor: '#ccc',
   borderWidth: 1,
   borderRadius: 5,
   paddingHorizontal: 10,
   marginBottom: 15,
   backgroundColor: '#fff',
 },
 modalCard: {
   backgroundColor: '#fafbfc',
   borderRadius: 24,
   padding: 18,
   width: '90%',
   maxWidth: 400,
   maxHeight: '80%',
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.08,
   shadowRadius: 8,
   elevation: 8,
   alignSelf: 'center',
 },
 inputWrapper: {
   position: 'relative',
   marginTop: 8,
   marginBottom: 16,
 },
 inputRow: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 16,
 },
 editIcon: {
   position: 'absolute',
   right: 10,
   top: 12,
   zIndex: 1,
 },
});