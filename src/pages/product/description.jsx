const Description = ({product}) => {
  return (
    <div className="text-[12px]">
      <div className="font-bold py-3">Chi tiết sản phẩm</div>
      <div dangerouslySetInnerHTML={{__html: product.compress_description}}></div>
    </div>
  )
}

export default Description