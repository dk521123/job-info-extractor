import streamlit as st

st.title('Hello world')
st.header('This is a header')

input_number = st.number_input('Input your number', value=0)

result = input_number * 2
st.write('Result: ', result)
