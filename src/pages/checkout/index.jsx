import React, { useEffect, useState } from "react"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { customerInfoState, cartItemsState, totalPriceState, amountPriceState } from "../../recoil/order"
import { Button, Input, message, Select } from "antd"
import { postApi } from "../../utils/request"
import { formatNumber } from "../../utils/formatNumber"
import { useNavigate } from "react-router-dom"
import { validatePhoneNumber, isValidEmail } from "../../utils/tools"
import { activeTabState } from "../../recoil/atoms"
import { memberZaloState, phoneMemberZaloState } from "../../recoil/member"
import { AirplaneTilt, Package, User, MapPinLine, Plus } from '@phosphor-icons/react'
import { listAddressState, openAddAddressState } from "../../recoil/order"
import CartItems from "../../components/cart-items"
import Bill from "../../components/bill"


const Checkout = () => {
  const setActiveTab = useSetRecoilState(activeTabState)
  const memberZalo = useRecoilValue(memberZaloState)
  const phoneMemberZalo = useRecoilValue(phoneMemberZaloState)
  const totalPrice = useRecoilValue(totalPriceState)
  const amountPrice = useRecoilValue(amountPriceState)
  const setOpenAddAddress = useSetRecoilState(openAddAddressState)
  

  const navigate = useNavigate()
  const country_id = 84
  const [customerInfo, setCustomerInfo] = useRecoilState(customerInfoState)
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)
  const [listAddress, setListAddress] = useRecoilState(listAddressState)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [provinces, setProvinces] = useState({})
  const [districts, setDistricts] = useState({})
  const [communes, setCommunes] = useState({})
  const [provinceId, setProvinceId] = useState()
  const [districtId, setDistrictId] = useState()
  const [communeId, setCommuneId] = useState()
  const [fullName, setFullName] = useState(memberZalo ?.name)
  const [phoneNumber, setPhoneNumber] = useState(phoneMemberZalo)
  const [email, setEmail] = useState()
  const [detectAddress, setDetectAddress] = useState()
  const [note, setNote] = useState()

  const renderProvince = () => {
    if(!window.WebAddress[country_id]) return
    const provinces = window.WebAddress[country_id] || {}
    let options = Object.keys(provinces).sort((a, b) => provinces[a].name.localeCompare(provinces[b].name))
    if (country_id == 84) {
      const idxHCM = options.findIndex(el => el == '701')
      options.splice(idxHCM, 1)
      options.unshift('701')

      const idxHN = options.findIndex(el => el == '101')
      options.splice(idxHN, 1)
      options.unshift('101')
    }

    setProvinces(options.map(el => ({value: el, label: <span>{provinces[el].name}</span>})))
  }

  const renderDistricts = () => {
    if (!provinceId) return
    const districts = window.WebAddress[country_id][provinceId] || {}
    let options = Object.keys(districts).filter(el => !['id', 'name', 'name_en'].includes(el))
    options.sort((a, b) => districts[a].name.localeCompare(districts[b].name))

    setDistricts(options.map(el => ({value: el, label: <span>{districts[el].name}</span>})))
  }

  const renderCommunes = () => {
    if (!districtId && !provinceId) return
    const communes = window.WebAddress[country_id][provinceId][districtId] || {}
    let options = Object.keys(communes).filter(el => !['id', 'name', 'name_en'].includes(el))
    options.sort((a, b) => communes[a].name.localeCompare(communes[b].name))
    setCommunes(options.map(el => ({value: el, label: <span>{communes[el].name}</span>})))
  }

  const setOrderItems = () => {
    const orders = cartItems.map(item => {
      const variation_info = {
        id: item.id,
        custom_id: item.custom_id,
        product_custom_id: item.product?.custom_id,
        display_id: item.display_id,
        variation_pos_id: item.variation_pos_id,
        original_price: item.original_price,
        retail_price: item.retail_price,
        weight: item.weight,
        name: item.name,
        images: item.images,
        fields: item.fields,
        product_id: item.product_id,
        retail_price_after_discount: item.wholesale_price_active || item.retail_price,
        original_price_after_discount: item.original_price,
        product_pos_id: item?.product_pos_id,
        images_custom: item.images_custom,
        is_design: item.is_design,
        discount_retail_price_web: item.discount_retail_price_web,
        discount_once: item.discount_once,
        discount_once_web: item.discount_once_web
      }

      return {
        variation_id: item.id,
        quantity: item.quantity,
        variation_info,
        category_ids: (item.categories || []).map(c => c.id)
      }
    })

    return orders
  }

  const checkValidForm = () => {
    if (!customerInfo ?.full_name) return message.error("Tên không được để trống!")
    if (!customerInfo ?.phone_number) return message.error("Số điện thoại không được để trống!")
    if (!validatePhoneNumber(customerInfo ?.phone_number)) return message.error("Số điện thoại không hợp lệ!")
    if (customerInfo ?.email && !isValidEmail(customerInfo ?.email)) return message.error("Email hợp lệ!")
    if (!customerInfo ?.province_id || !customerInfo ?.district_id || !customerInfo ?.commune_id) return message.error("Địa chỉ không được để trống!")
  }

  const handleOrder = async () => {
    checkValidForm()

    let data = {
      order_items: setOrderItems(),
      shipping_address: {...customerInfo, note: note}
    }

    setLoadingOrder(true)
    const res = await postApi("/orders/quick_order", data)
    console.log(res, "res orderrrr")
    if (res.status == 200) {
      setCustomerInfo(customerInfo)

      message.success("Đặt hàng thành công")
      afterSubmitSuccess()
      navigate("/")
    } else {
      message.error("Lỗi đặt hàng")
    }
    setLoadingOrder(false)
  }

  const afterSubmitSuccess = () => {
    setCartItems([])
    localStorage.removeItem('cartItems')
  }

  const handleChangeProvince = (value, option) => {
    if (value != provinceId) {
      setCommuneId(null)
      setDistrictId(null)
      setCommunes([])
      setDistricts([])
    }
    setProvinceId(value)
  }

  const handleChangeDistrict = (value, option) => {
    if (value != districtId) {
      setCommuneId(null)
      setCommunes([])
    }
    setDistrictId(value)
  }

  const handleChangeCommune = (value, option) => {
    setCommuneId(value)
  }

  const handleChange = (key, value) => {
    switch(key) {
      case 'full_name':
        setFullName(value)
        break
      case 'phone_number':
        const formatPhone = value.replace(/\D/g, "");
        setPhoneNumber(formatPhone)
        break
      case 'email':
        setEmail(value)
        break
      case 'note':
        setNote(value)
        break
      case 'detect_address':
        setDetectAddress(value)
      break

    }
  }

  const goTo = (path) => {
    navigate(path)
  }

  useEffect(() => {
    renderProvince()
  }, [window.WebAddress])

  useEffect(() => {
    renderDistricts()
  },[provinceId])

  useEffect(() => {
    renderCommunes()
  }, [districtId])

  useEffect(() => {
    const list_address = JSON.parse(localStorage.getItem('list-address') || '[]')
    let address = list_address.find(el => el.default)
    if (address) return setCustomerInfo(address)
    if (!address && list_address.length > 0) return setCustomerInfo(list_address[0])
    if (list_address.length == 0) return setCustomerInfo(null)
    }, [listAddress])

  // useEffect(() => {
  //   setActiveTab('checkout')
  // }, [])

  return (
    <>
    <div className="absolute top-[36px] bg-[#fff] h-[calc(100vh-133px)] overflow-y-auto w-full">
      <div className="p-3 border-b border-b-solid border-b-[#dcdcdc]">
        <div className="font-bold pb-3">Hình thức giao hàng</div>
        <div className="flex justify-between">
          <Button className="h-[42px] w-1/2 mr-2 border border-solid border-[#000]">
            <div><AirplaneTilt size={24} color="#292929" weight="duotone" /></div>
            <div>Giao tận nơi</div>
          </Button>
          <Button className="h-[42px] w-1/2 ml-2" disabled={true}>
            <div><Package size={24} color="#292929" weight="duotone" /></div>
            <div>Tự đến lấy</div>
          </Button>
        </div>
      </div>

      <div className="p-3 border-b-[8px] border-b-solid border-b-[#efefef]">
        { customerInfo 
        ?
        <div>
          <div className="flex justify-between">
            <div className="font-bold">Thông tin người nhận hàng</div>
            <div onClick={() => goTo('/address')}>Thay đổi</div>
          </div>
          <div>
            <div className="flex pt-2">
              <User size={18} color="#cccccc" weight="fill" />
              <div className="flex pl-2">
                <div className="font-bold">{customerInfo.full_name}</div>
                <div className="px-2"> | </div>
                <div>{customerInfo.phone_number}</div>
              </div>
            </div>
            <div className="flex pt-2">
              <MapPinLine size={18} color="#cccccc" weight="fill" />
              <div className="pl-2">
                {customerInfo.decode_address}
              </div>
            </div>
          </div>
        </div>
        :
        <div onClick={() => setOpenAddAddress(true)} className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center bg-[#f3f3f3] rounded-full w-[42px] h-[42px]"><Package size={24} color="#ccc" weight="light"  /></div>
          <div className="flex items-center pt-2">
            <div className="pr-2">
              <Plus size={18} color="#000" weight="light" />
            </div>
            <div>Thêm địa chỉ nhận hàng</div>
          </div>
        </div>
        }
      </div>

      {/* <div className="">

        <CartItems />
        <div className="my-4 border-b-2 border-solid border-[#bcbcbc]"></div>
        <div className="px-2">
          <div className="flex justify-between pb-1">
            <div>Tổng tiền: </div>
            <div>{formatNumber(totalPrice)}</div>
          </div>
          <div className="flex justify-between pb-1">
            <div>Giảm giá đơn hàng:</div>
            <div>{formatNumber(0)}</div>
          </div>
          <div className="flex justify-between pb-1">
            <div className="font-bold">Số tiền phải thanh toán:</div>
            <div>{formatNumber(amountPrice)}</div>
          </div>
        </div>
        <div className="my-4 border-b-2 border-solid border-[#bcbcbc]"></div>
      </div> */}
      {/* <div className="px-2">
        <div className="text-[18px] font-bold">Thông tin giao hàng</div>
        <div className="bg-[#fff] p-2">
          <Input
            className="mb-2"
            placeholder="Họ và tên"
            size="large"
            onChange={e => handleChange('full_name', e.target.value)}
            value={fullName}
          />
          <Input
            className="mb-2"
            placeholder="Số điện thoại"
            size="large"
            onChange={e => handleChange('phone_number', e.target.value)}
            value={phoneNumber}
          />
          <Input
            className="mb-2"
            placeholder="Email"
            size="large"
            onChange={e => handleChange('email', e.target.value)}
            value={email}
          />
          <div className="mb-2">
            <Select 
              className="w-full h-10"
              placeholder="Chọn Tỉnh/ Thành phố"
              options={provinces}
              value={provinceId}
              onChange={handleChangeProvince}
            /> 
          </div>
          <div className="mb-2">
            <Select
              value={districtId}
              className="w-full h-10"
              placeholder="Chọn Quận/ Huyện"
              options={districts}
              onChange={handleChangeDistrict}
            />
          </div>

          <div className="mb-2">
            <Select
              value={communeId}
              className="w-full h-10"
              placeholder="Chọn Phường/ Xã"
              options={communes}
              onChange={handleChangeCommune}
            />
          </div>

          <Input
            className="mb-2"
            placeholder="Địa chỉ chi tiết"
            size="large"
            onChange={e => handleChange('detect_address', e.target.value)}
            value={detectAddress}
          />
          <Input
            className="mb-2"
            placeholder="Ghi chú"
            size="large"
            onChange={e => handleChange('note', e.target.value)}
            value={note}
          />

        </div>
      </div> */}

      {/* <div className="px-2 my-2">
        <Button
          loading={loadingOrder}
          type="primary"
          className="w-full h-10"
          onClick={() => handleOrder()}>
          Hoàn thành đơn hàng
        </Button>
      </div> */}

      <div className="p-3 border-b border-b-solid border-b-[#dcdcdc]">
        <div className="font-bold">Sản phẩm đã chọn ({cartItems.length || 0})</div>
        <CartItems />
      </div>
      <div className="p-3 border-b-[8px] border-b-solid border-b-[#efefef]">
        <div className="flex justify-between items-center">
          <div className="font-bold">Ghi chú</div>
          <div>...</div>
        </div>
      </div>

      <div>
        <Bill />
      </div>

    </div>
    <div>
      <div className="px-3 pt-3 bg-[#fff] border-t border-t-solid border-t-[#efefef] fixed bottom-0 w-full">
        <div className="">
          <div className="flex justify-between pb-3">
            <div className="font-bold">Tổng thanh toán:</div>
            <div className="font-bold">{formatNumber(totalPrice)}</div>
          </div>
          <div className="flex w-full">
            <Button disabled={cartItems.length == 0 ? true : false} color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={handleOrder}> Đặt hàng</Button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Checkout