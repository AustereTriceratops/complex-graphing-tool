interface NumberDisplayProps {
    title: string;
    value: string;
}

const NumberDisplay = ({title, value}: NumberDisplayProps) => {
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
    );
};

export default NumberDisplay;
