const Description = ({product}) => {
  return (
    <div className="text-[12px]">
      <div className="font-bold py-3">Chi tiết sản phẩm</div>
      <div dangerouslySetInnerHTML={{__html: product.compress_description}}></div>
      <div>
        sdfsfsfsfsdfsdfdfdsfsdf
        dfdfd
        fd
        fd
        fd
        fd
        fdddd
        ddddd
        dddddddd
        dddddddd
        ddddd
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div><div>sdfsfdsf</div>
        <div>sdfsfdsf</div><div>sdfsfdsf</div>
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div>
        <div>sdfsfdsf</div><div>sdfsfdsf</div><div>sdfsfdsf</div><div>sdfsfdsf</div><div>sdfsfdsf</div>
      </div>
    </div>
    
  )
}

export default Description