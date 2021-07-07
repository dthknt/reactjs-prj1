import { Component } from 'react';
import '../styles/global-styles.css';
import './styles.css';

import { PostCard } from '../components/PostCard';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';

class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    ppp: 10
  };
  
  componentDidMount() {
    this.loadPosts();
  }

  loadPosts = async () => {
    const postsResp = fetch('https://jsonplaceholder.typicode.com/posts');
    const fotosResp = fetch('https://jsonplaceholder.typicode.com/photos');
    
    const [posts, fotos] = await Promise.all([postsResp, fotosResp]);
    
    const postsJson = await posts.json();
    const fotosJson = await fotos.json();

    const postsEFotos = postsJson.map((post, index) => {
      return {...post, cover: fotosJson[index].url};
    });

    const {page, ppp} = this.state;
    this.setState({
      posts: postsEFotos.slice(page, ppp), 
      allPosts: postsEFotos
      });
  }

  carregaMaisPosts = () => {
    const {page, ppp, allPosts, posts} = this.state;
    const nextPage = page + ppp;
    const nextPosts = allPosts.slice(nextPage, nextPage + ppp);
    posts.push(...nextPosts);

    this.setState({posts, page: nextPage});
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  handleChangeSearch = (e) => {
    const {value} = e.target;
    this.setState({termoBusca: value});
  }

  render() {
    const { posts, page, ppp, allPosts, termoBusca } = this.state;
    const fimPosts = page + ppp >= allPosts.length;

    const postsFiltrados = !!termoBusca ? 
    allPosts.filter((post) => {
      return post.title.toLowerCase().includes(termoBusca);
    }):
    posts;

    return (
      <section className="container">
        <div className="search-container">
          {!!termoBusca && (<>
              <h1>Procurando por: {termoBusca}</h1><br/></>
          )} 
          
          <TextInput 
            termoBusca={termoBusca}
            handleChangeSearch={this.handleChangeSearch} />
          <p/>
        </div>

        {postsFiltrados.length > 0 ? (
        <div className="posts">
          {postsFiltrados.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        ): (
          <p>Nenhum post encontrado !</p>
        )}

        <div className="button-container">
        {!termoBusca && (<>
          <Button texto="Carregar Mais Posts"
            onClick={this.carregaMaisPosts} 
            disabled={fimPosts} />
        </>)}
        </div>
      </section>
    );
  }
}
export default Home;