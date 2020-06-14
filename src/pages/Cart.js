import React, { useState, useEffect } from 'react'
import { Table, Container, Row, Col, ListGroup, Image, Button } from "react-bootstrap"
import { withRouter } from "react-router-dom";
import { GrFormSubtract, GrFormAdd } from "react-icons/gr";

function Cart(props) {
  const [mycart, setMycart] = useState([])
  const [mycartDisplay, setMycartDisplay] = useState([])

  useEffect(() => {
    const initCart = localStorage.getItem('cart') || '[]'
    const cartJson = JSON.parse(initCart)

    console.log(cartJson)

    setMycart(cartJson)

  }, [])


  useEffect(() => {
    let newMycartDisplay = []

    console.log('mycart', mycart)

    for (let i = 0; i < mycart.length; i++) {
      const index = newMycartDisplay.findIndex(
        (value) => value.id === mycart[i].id
      )

      if (index !== -1) {
        newMycartDisplay[index].amount += mycart[i].amount
      } else {
        const newItem = { ...mycart[i] }
        newMycartDisplay = [...newMycartDisplay, newItem]
      }
    }

    console.log('newMycartDisplay', newMycartDisplay)
    setMycartDisplay(newMycartDisplay)
  }, [mycart])

  function updateCartToLocalStorage (value) {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || []

    const newCart = [...currentCart, value]
    localStorage.setItem('cart', JSON.stringify(newCart))

    setMycart(newCart);
  }

  function substarctCartToLocalStorage (value) {
    
    let foundObj = mycart.find(obj => obj.name === value.name)
    let filtered = mycart.filter(el => el != foundObj);
    const newCart = filtered
    localStorage.setItem('cart', JSON.stringify(newCart))

    setMycart(newCart);
  }



  // 計算總價用的函式
  function sum(items) {
    let total = 0
    for (let i = 0; i < items.length; i++) {
      total += items[i].amount * items[i].price
    }
    return total
  }



  return (
    <> 
    {mycartDisplay.length > 0 ? (
    <Container>
      <Row>
          <Col sm={9} className="d-flex fd-col">
          {mycartDisplay.map(value => ( 
                  <Container className="mt-0 m-3">
                      <Row>
                          <Col xs={3}>
                              <Image
                              width={100}
                              height={100}
                              className="mr-3"
                              src={`/items/${value.img}`}
                              alt={value.img}
                              />
                          </Col>
                          <Col xs={8}>
                              <Row className="d-flex">
                                  <p className="w-25">{value.name}</p>
                                  <p className="w-25 text-right">${value.price}</p>
                                  <p className="w-25 text-right">
                                    <GrFormSubtract onClick={() => substarctCartToLocalStorage({
                                        id: value.id,
                                        img: value.img,
                                        name: value.name,
                                        amount: 1,
                                        price: value.price
                                      }) }/>
                                      {" "}
                                      {value.amount}
                                      {" "}
                                    <GrFormAdd  onClick={() => updateCartToLocalStorage({
                                        id: value.id,
                                        img: value.img,
                                        name: value.name,
                                        amount: 1,
                                        price: value.price
                                      }) } />
                                  </p>
                                  <p className="w-25 text-right">${value.price * value.amount}</p>
                              </Row>
                              <Row className="mt-2">
                                  <Button className="mt-2 mb-2" size="sm" variant="primary">優惠活動</Button>
                              </Row>
                          </Col>
                      </Row>
                  </Container>
            ))}
            </Col>
            <Col sm={3} className="d-flex fd-col p-3 pl-5">
              <h6>商品總金額</h6>
              <h5>小計  ${sum(mycartDisplay)}</h5>
              <h5>運費  $</h5>
              <hr className="mt-5" />
              <h5>總金額  ${sum(mycartDisplay)}</h5>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center pt-3 pb-3">
            <Button className="mt-2 mb-2" variant="outline-primary" onClick={() => props.history.push("/cart/comfirm")}>去買單</Button>
          </Row> 
        </Container> ) : (
          <div className="d-flex fd-col justify-content-center align-items-center">
              <h2 className="mt-3 mb-3">購物車沒有東西</h2>
              <Button className="mt-2 mb-2" variant="outline-primary" onClick={() => {
                        props.history.push("/shop");
                        localStorage.setItem("page",1);
                      }}>繼續購物</Button>
          </div>

        )}
    </>
  )
}

export default withRouter(Cart)