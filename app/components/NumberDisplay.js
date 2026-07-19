const NumberInput = (props) => {
    const {title, value} = props;

    return (
        <div style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            gap: '0.75rem'
        }}>
            <div>
                {title}
            </div>
            <div>
                {value}
            </div>
        </div>
    )
}

export default NumberInput;
