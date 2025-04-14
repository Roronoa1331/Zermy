export default function ContactsPage() {
  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold">Əlaqə</h1>
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">Bizimlə əlaqə saxlayın</p>
          <a 
            href="mailto:zermy1331@gmail.com" 
            className="text-2xl font-medium hover:text-primary transition-colors"
          >
            zermy1331@gmail.com
          </a>
          <br></br>
          <p className="text-l  g text-muted-foreground">Bizi Instagramda izləyin</p>
          <a 
            href="https://www.instagram.com/zermy.app/" 
            className="text-3xl font-medium hover:text-primary transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  )
} 